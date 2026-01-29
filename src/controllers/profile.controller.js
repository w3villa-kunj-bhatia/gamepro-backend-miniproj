const profileService = require("../services/profile.service");
const { success } = require("../utils/response");
const plans = require("../config/plans");
const AppError = require("../utils/AppError");
const User = require("../models/User");

exports.upsertProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const freshUser = await User.findById(req.user.id);
    if (!freshUser) {
      throw new AppError("User not found", 404);
    }

    const userPlan = freshUser.plan || "free";
    const planConfig = plans[userPlan] || plans.free || { games: 3 };
    const gameLimit = planConfig.games;

    let profileData = { ...req.body };

    if (req.file) {
      console.log("File uploaded to Cloudinary:", req.file.path);
      profileData.avatar = req.file.path;
    }

    ["games", "topCharacters", "coordinates"].forEach((field) => {
      if (typeof profileData[field] === "string") {
        try {
          profileData[field] = JSON.parse(profileData[field]);
        } catch (e) {
          console.error(`Failed to parse field '${field}':`, e.message);
          delete profileData[field];
        }
      }
    });

    if (
      profileData.games &&
      Array.isArray(profileData.games) &&
      profileData.games.length > gameLimit
    ) {
      throw new AppError(
        `Your ${userPlan} plan allows only ${gameLimit} games.`,
        403,
      );
    }

    const profile = await profileService.upsertProfile(
      req.user.id,
      profileData,
    );

    success(res, profile, "Profile saved successfully");
  } catch (err) {
    console.error("Profile Controller Error:", err);
    next(err);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getOwnProfile(req.user.id);
    success(res, profile);
  } catch (err) {
    next(err);
  }
};
