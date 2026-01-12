const cron = require("node-cron");
const User = require("../models/User");
const SavedProfile = require("../models/SavedProfile");
const plans = require("../config/plans");

const runPlanExpiryJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("[CRON] Running plan expiry job");

    const now = new Date();

    const expiredUsers = await User.find({
      plan: { $in: ["silver", "gold"] },
      planExpiresAt: { $lte: now },
    });

    for (const user of expiredUsers) {
      user.plan = "free";
      user.planExpiresAt = null;
      await user.save();

      console.log(`[CRON] User ${user.email} downgraded to FREE`);
    }
    const freeLimit = plans.free.savedProfiles;

    const savedProfiles = await SavedProfile.find({ User: User._id }).sort({
      createdAt: 1,
    }); 

    savedProfiles.forEach((sp, index) => {
      sp.locked = index >= freeLimit;
    });

    await Promise.all(savedProfiles.map((sp) => sp.save()));
  });
};

module.exports = runPlanExpiryJob;
