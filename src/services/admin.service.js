const User = require("../models/User");
const Profile = require("../models/Profile");

exports.getAllUsers = async ({ search, plan, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  let userIds = [];

  if (search) {
    const profiles = await Profile.find({
      username: { $regex: search, $options: "i" },
    }).select("user");
    userIds = profiles.map((p) => p.user);
  }

  const query = { role: { $ne: "admin" } };

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: "i" } },
      { _id: { $in: userIds } },
    ];
  }

  if (plan) {
    query.plan = plan;
  }

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};
