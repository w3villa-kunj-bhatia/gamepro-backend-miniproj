const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password:{ type: String},

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
