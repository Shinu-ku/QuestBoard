const express = require("express");
const Quest = require("../models/Quest");
const User = require("../models/User");
const auth = require("../middleware/auth");
const xpEngine = require("../services/xpEngine");

const router = express.Router();


// =======================
// RARITY GENERATOR
// =======================
function generateRarity(){
  const r = Math.random();

  if(r < 0.60) return "common";
  if(r < 0.85) return "rare";
  if(r < 0.95) return "epic";
  return "legendary";
}



// =======================
// CREATE QUEST
// =======================
router.post("/create", auth, async (req, res) => {
  try {
    const { title, description, questType } = req.body;

    let expiresAt = new Date();

    if (questType === "daily")
      expiresAt.setDate(expiresAt.getDate() + 1);

    if (questType === "weekly")
      expiresAt.setDate(expiresAt.getDate() + 7);

    if (questType === "monthly")
      expiresAt.setMonth(expiresAt.getMonth() + 1);


    // RARITY
    const rarity = generateRarity();

    let baseXP = 10;
    if (questType === "weekly") baseXP = 30;
    if (questType === "monthly") baseXP = 80;

    const multipliers = {
      common:1,
      rare:2,
      epic:4,
      legendary:8
    };

    const xp = baseXP * multipliers[rarity];


    const quest = await Quest.create({
      userId: req.session.userId,
      title,
      description,
      questType,
      rarity,
      xp,
      expiresAt
    });

    res.json(quest);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// DELETE QUEST
// =======================
router.delete("/delete/:id", auth, async (req, res) => {
  try {
  
    const quest = await Quest.findById(req.params.id)
  
    if(!quest)
      return res.status(404).json({msg:"Quest not found"})
  
    if(quest.userId.toString() !== req.session.userId)
      return res.status(403).json({msg:"Not allowed"})
  
    await quest.deleteOne()

    res.json({message:"Quest deleted"})

  } catch(err) {
    res.status(500).json({error:err.message})
  }
})
    

// =======================
// COMPLETE QUEST
// =======================
router.post("/complete/:id", auth, async (req, res) => {
  try {

    const quest = await Quest.findById(req.params.id);
    if (!quest)
      return res.status(404).json({ msg: "Quest not found" });

    if (quest.status !== "active")
      return res.status(400).json({ msg: "Already finished" });

    if (new Date() > quest.expiresAt) {
      quest.status = "failed";
      await quest.save();
      return res.json({ msg: "Quest expired" });
    }

    // mark completed
    quest.status = "completed";
    quest.completedAt = new Date();
    await quest.save();


    // ======================
    // USER UPDATE
    // ======================
    const user = await User.findById(req.session.userId);

    // XP ENGINE
    const result = xpEngine.addXP(user, quest.xp);


    // ======================
    // STREAK SYSTEM
    // ======================
    if (quest.questType === "daily") {

      const today = new Date().toDateString();
      const last = user.lastDailyCompleted
        ? new Date(user.lastDailyCompleted).toDateString()
        : null;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (last === today) {
        // already counted today → do nothing
      }
      else if (last === yesterday.toDateString()) {
        user.streak += 1;
      }
      else {
        user.streak = 1;
      }

      user.lastDailyCompleted = new Date();
    }

    await user.save();




    // ======================
    // RESPONSE
    // ======================
    res.json({
      message: "Quest completed",
      reward: quest.xp,
      rarity: quest.rarity,
      totalXP: result.xp,
      level: result.level,
      streak: user.streak,
      leveledUp: result.leveledUp
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// =======================
// GET MY QUESTS
// =======================
router.get("/my", auth, async (req, res) => {
  const quests = await Quest.find({ userId: req.session.userId });
  res.json(quests);
});



module.exports = router;
