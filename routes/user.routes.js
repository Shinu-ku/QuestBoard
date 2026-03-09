const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.session.userId).select("-password");
  res.json(user);
});

module.exports = router;
