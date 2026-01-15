const User = require("../models/User");
const { success } = require("../utils/response");

exports.getUsers = async (req, res, next) => {
  try {
    const { search, plan, page = 1, limit = 10 } = req.query;

    const query = { role: "user" };

    if (search) {
      query.email = { $regex: search, $options: "i" };
    }

    if (plan) {
      query.plan = plan;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(query)
      .select("-password") 
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    success(
      res,
      {
        users,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
      "Users fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};
