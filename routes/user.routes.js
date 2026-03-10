const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.session.userId).select("-password");
  res.json(user);
});

module.exports = router;

// ======================
// UPDATE AVATAR
// ======================
router.post("/avatar", auth, async (req,res)=>{
  try{

    const { avatar } = req.body

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      {
        avatar,
        avatarType:"default"
      },
      { returnDocument: "after" }
    )

    res.json({
      msg:"Avatar updated",
      avatar:user.avatar
    })

  }catch(err){
    res.status(500).json({error:err.message})
  }
})