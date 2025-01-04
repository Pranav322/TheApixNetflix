const mongoose = require("mongoose");

const episodesSchema = new mongoose.Schema({
  episode_url: {
    type: String,
    required: true,
  },
  episode_time: {
    type: String,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movie",
  },
});

module.exports = mongoose.model("episodes", episodesSchema);
