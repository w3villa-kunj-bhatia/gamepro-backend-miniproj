const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");
const plans = require("../config/plans");
const { success } = require("../utils/response");
const AppError = require("../utils/AppError");

const PLAN_PRICES = {
  silver: { amount: 999, name: "Silver Membership" },
  gold: { amount: 1999, name: "Gold Membership" },
};

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const plan = PLAN_PRICES[planId];

    if (!plan) throw new AppError("Invalid plan selected", 400);

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: `Upgrade to ${planId} tier`,
            },
            unit_amount: plan.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/payment/cancel`,
      metadata: {
        userId: req.user.id,
        planId: planId,
      },
    });

    success(res, { url: session.url });
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { session_id } = req.body;

    if (!session_id) throw new AppError("Session ID is required", 400);

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      throw new AppError("Payment not completed", 400);
    }

    const { userId, planId } = session.metadata;

    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    user.plan = planId;
    if (plans[planId].duration) {
      user.planExpiresAt = new Date(Date.now() + plans[planId].duration);
    } else {
      user.planExpiresAt = null;
    }

    await user.save();

    success(res, { plan: user.plan }, "Membership upgraded successfully!");
  } catch (err) {
    next(err);
  }
};
