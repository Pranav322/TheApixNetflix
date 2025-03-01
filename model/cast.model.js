const mongoose = require("mongoose");

const castSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  bio: {
    type: String,
  },
  movieId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("cast", castSchema);
