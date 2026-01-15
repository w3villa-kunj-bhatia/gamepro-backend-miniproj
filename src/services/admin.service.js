const User = require("../models/User");

exports.getAllUsers = async ({ search, plan, page = 1, limit = 10 }) => {
  const query = { role: { $ne: "admin" } }; 
  if (search) {
    query.email = { $regex: search, $options: "i" };
  }

  if (plan) {
    query.plan = plan;
  }

  const skip = (page - 1) * limit;

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
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
