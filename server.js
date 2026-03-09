require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authRoutes = require("./routes/auth.routes");
const questRoutes = require("./routes/quest.routes");
const userRoutes = require("./routes/user.routes");
const friendRoutes = require("./routes/friend.routes");

const connectDB = require("./config/db");

const app = express();

// DB
connectDB();
require("./scheduler");

// Middleware
app.use(express.json());

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// Routes 
app.use(express.static("public"));
app.use("/api/auth", authRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friends", friendRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("QuestBoard API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
