const mongoose = require("mongoose");
const xpEngine = require("../services/xpEngine");

const questSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: String,

  questType: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: true
  },
  
  rarity:{
  type:String,
  enum:["common","rare","epic","legendary"],
  default:"common"
  },

  xp: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["active", "completed", "failed"],
    default: "active"
  },

  expiresAt: Date,
  completedAt: Date

}, { timestamps: true });

module.exports = mongoose.model("Quest", questSchema);
