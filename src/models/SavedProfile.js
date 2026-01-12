const mongoose = require("mongoose");

const savedProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    locked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

savedProfileSchema.index({ user: 1, profile: 1 }, { unique: true });

module.exports = mongoose.model("SavedProfile", savedProfileSchema);
