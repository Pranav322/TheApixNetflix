const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to the user schema
    required: true,
  },
  movie_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movie", // Reference to the movie schema
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("wishlist", wishlistSchema);
