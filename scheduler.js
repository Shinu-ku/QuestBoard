const cron = require("node-cron");
const Quest = require("./models/Quest");

cron.schedule("* * * * *", async () => {
  console.log("⏰ Cron running...");

  const now = new Date();

  try {
    const expired = await Quest.updateMany(
      {
        status: "active",
        expiresAt: { $lt: now }
      },
      {
        $set: { status: "failed" }
      }
    );

    if (expired.modifiedCount > 0) {
      console.log(`Expired quests marked failed: ${expired.modifiedCount}`);
    }

  } catch (err) {
    console.error("Cron error:", err.message);
  }
});
