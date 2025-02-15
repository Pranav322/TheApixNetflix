const mongoose = require("mongoose");

const episodesSchema = new mongoose.Schema({
  episodeName: {
    type: String,
    required: true,
  },
  seasonName: {
    type: String,
    required: true,
  },
  seasonNumber: {
    type: Number,
    required: true,
  },
  movieId: {
    type: String, // Unique identifier for the associated movie
    required: true,
  },
  videoDetails: {
    originalUrl: String,
    publicId: String,
    secureUrl: String,
    duration: {
      type: String,
      required: true,
    },
    format: String,
    thumbnailUrl: String,
    resolutions: [
      {
        quality: String,
        url: String,
      },
    ],
  },
});

module.exports = mongoose.model("episodes", episodesSchema);
