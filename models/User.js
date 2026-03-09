const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
      required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
  type:String,
  default:"male1.png"
  },
  avatarType:{
    type:String,
    enum:["default","custom"],
    default:"default"
  },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastDailyCompleted: Date,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
