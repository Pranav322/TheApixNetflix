// models/movie.model.js
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  movieId: {
    type: String, // Unique identifier for the movie
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
  },
  type: {
    type: String,
    enum: ["movie", "show"],
    default: "movie",
  },
  categoryTags: {
    type: [String], // List of genres or category tags
    default: [],
  },
  rentAmount: {
    type: Number, // Rental price for the movie
  },
  language: {
    type: String, // Language of the movie
  },
  videoDetails: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoDetails'
  }],
  rentalCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Movie", movieSchema);
