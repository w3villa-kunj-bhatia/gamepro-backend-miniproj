const User = require("../models/User");

exports.getAllUsers = async ({ search, plan, page = 1, limit = 10 }) => {
  const query = { role: { $ne: "admin" } }; // Typically admins don't manage other admins here

  // 1. Search Functionality (by email)
  if (search) {
    query.email = { $regex: search, $options: "i" };
  }

  // 2. Filter Functionality (by plan)
  if (plan) {
    query.plan = plan;
  }

  const skip = (page - 1) * limit;

  // 3. Pagination and Data Retrieval
  const users = await User.find(query)
    .select("-password") // Exclude passwords for security
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
