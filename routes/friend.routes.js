const express = require("express");
const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const auth = require("../middleware/auth");

const router = express.Router();


// ===================
// SEND REQUEST
// ===================
router.post("/send/:id", auth, async (req,res)=>{
  try{

    if(req.params.id === req.session.userId)
      return res.status(400).json({msg:"Cannot add yourself"});

    const exists = await FriendRequest.findOne({
      sender:req.session.userId,
      receiver:req.params.id
    });

    if(exists)
      return res.json({msg:"Request already sent"});

    const request = await FriendRequest.create({
      sender:req.session.userId,
      receiver:req.params.id
    });

    res.json(request);

  }catch(err){
    res.status(500).json({error:err.message});
  }
});



// ===================
// GET REQUESTS
// ===================
router.get("/requests", auth, async (req,res)=>{
  const requests = await FriendRequest.find({
    receiver:req.session.userId,
    status:"pending"
  }).populate("sender","username level xp");

  res.json(requests);
});



// ===================
// ACCEPT REQUEST
// ===================
router.post("/accept/:id", auth, async (req,res)=>{
  try{

    const request = await FriendRequest.findById(req.params.id);

    if(!request)
      return res.status(404).json({msg:"Request not found"});

    request.status = "accepted";
    await request.save();

    // add each other as friends
    await User.findByIdAndUpdate(request.sender,{
      $push:{ friends: request.receiver }
    });

    await User.findByIdAndUpdate(request.receiver,{
      $push:{ friends: request.sender }
    });

    res.json({msg:"Friend added"});

  }catch(err){
    res.status(500).json({error:err.message});
  }
});



// ===================
// REJECT REQUEST
// ===================
router.post("/reject/:id", auth, async (req,res)=>{
  await FriendRequest.findByIdAndUpdate(req.params.id,{
    status:"rejected"
  });

  res.json({msg:"Rejected"});
});



// ===================
// GET FRIEND LIST
// ===================
router.get("/list", auth, async (req,res)=>{
  const user = await User.findById(req.session.userId)
    .populate("friends","username level xp streak");

  res.json(user.friends);
});



module.exports = router;
