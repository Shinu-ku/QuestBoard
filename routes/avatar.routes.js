const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

const upload = multer({
  limits:{ fileSize: 5 * 1024 * 1024 }
})

router.post("/upload", auth, upload.single("avatar"), async (req,res)=>{

  const filename = "user_" + req.session.userId + ".png"

  await sharp(req.file.buffer)
    .resize(512,512)
    .png()
    .toFile("public/avatars/users/" + filename)

  await User.findByIdAndUpdate(req.session.userId,{
    avatar:filename,
    avatarType:"custom"
  })

  res.json({avatar:filename})
})

module.exports = router
