const dashboardService = require("../services/dashboard.service");
const { success } = require("../utils/response");

exports.getProfiles = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const result = await dashboardService.getProfiles({
      userId: req.user.id,
      page,
      limit,
      search, 
    });

    success(res, result);
  } catch (err) {
    next(err);
  }
};
