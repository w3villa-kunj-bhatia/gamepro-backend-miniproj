const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  username: String,
  avatar: String,

  address: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },

  games: [
    {
      name: String,
      platform: String,
      skill: String,
      coverUrl: String,
    },
  ],
  topCharacters: [{
    name: String,
    imageUrl: String
  }]
});

module.exports = mongoose.model("Profile", profileSchema);
