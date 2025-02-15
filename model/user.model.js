const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
  },
  user_type: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true,
  },
  purchasedMovies: {
    type: [String], // Array of movie IDs the user has purchased
    default: [], // Default is an empty array
  },
});

module.exports = mongoose.model("User", userSchema);
