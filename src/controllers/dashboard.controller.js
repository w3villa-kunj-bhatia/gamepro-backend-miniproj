const dashboardService = require("../services/dashboard.service");
const { success } = require("../utils/response");

exports.getProfiles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || "";
    const userId = req.user.id; 

    const result = await dashboardService.getProfiles({
      userId,
      page,
      limit,
      search,
    });

    success(res, result);
  } catch (err) {
    next(err);
  }
};
