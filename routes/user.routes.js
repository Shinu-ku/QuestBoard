const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const Quest = require("../models/Quest");

const router = express.Router();


// ======================
// GET CURRENT USER
// ======================

router.get("/me", auth, async (req, res) => {

const user = await User
.findById(req.session.userId)
.select("-password");

res.json(user);

});


// ======================
// UPDATE AVATAR
// ======================

router.post("/avatar", auth, async (req,res)=>{

try{

const { avatar } = req.body;

const user = await User.findByIdAndUpdate(
req.session.userId,
{
avatar,
avatarType:"default"
},
{ returnDocument: "after" }
);

res.json({
msg:"Avatar updated",
avatar:user.avatar
});

}catch(err){
res.status(500).json({error:err.message});
}

});


// ======================
// PLAYER STATS
// ======================

router.get("/stats", auth, async (req,res)=>{

try{

const userId = req.session.userId;

const completed = await Quest.countDocuments({
userId,
status:"completed"
});

const active = await Quest.countDocuments({
userId,
status:"active"
});

const failed = await Quest.countDocuments({
userId,
status:"failed"
});

res.json({
completed,
active,
failed
});

}catch(err){

res.status(500).json({error:"Failed to fetch stats"});

}

});

module.exports = router;