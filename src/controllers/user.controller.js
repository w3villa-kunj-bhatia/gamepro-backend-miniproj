const plans = require("../config/plans");

exports.upgradeUserPlan = async (req, res, next) => {
  try {
    const { plan } = req.body; 
    const user = req.user;     

    if (!plans[plan]) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    user.plan = plan;

    if (plans[plan].duration) {
      user.planExpiresAt = new Date(Date.now() + plans[plan].duration);
    } else {
      user.planExpiresAt = null;
    }

    await user.save();

  } catch (err) {
    next(err);
  }
};