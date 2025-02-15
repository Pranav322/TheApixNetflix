const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  userName:{
    type: String,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("review", reviewSchema);
