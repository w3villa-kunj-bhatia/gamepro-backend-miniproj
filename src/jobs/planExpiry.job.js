const cron = require("node-cron");
const User = require("../models/User");

cron.schedule("*/10 * * * *", async () => {
  await User.updateMany(
    { plan: { $ne: "free" }, planExpiresAt: { $lt: new Date() } },
    { plan: "free", planExpiresAt: null }
  );
});
