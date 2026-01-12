const dashboardService = require("../services/dashboard.service");
const { success } = require("../utils/response");

exports.getProfiles = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const result = await dashboardService.getProfiles({
      userId: req.user.id,
      page,
      limit,
    });

    success(res, result);
  } catch (err) {
    next(err);
  }
};
