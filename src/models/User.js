const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: {
      type: String,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(value);
        },
        message:
          "Password must contain at least 1 number, 1 uppercase letter, and 1 special character.",
      },
    },

    googleId: { type: String },
    facebookId: { type: String },

    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },

    emailVerificationToken: String,
    emailVerificationExpires: Date,

    plan: {
      type: String,
      enum: ["free", "silver", "gold"],
      default: "free",
    },
    planExpiresAt: Date,
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
