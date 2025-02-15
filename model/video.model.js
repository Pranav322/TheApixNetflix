
const mongoose = require("mongoose");

const videoDetailsSchema = new mongoose.Schema({
  movieId: {
    type: String, // Unique identifier for the associated movie
    required: true,
    unique: true, // Ensures each video detail is linked to a unique movie
  },
  originalUrl: {
    type: String, // Original video URL
  },
  publicId: {
    type: String, // Public ID for video hosting services like Cloudinary
  },
  secureUrl: {
    type: String, // Secure video URL
  },
  duration: {
    type: String, // Duration of the movie or show
    required: true,
  },
  format: {
    type: String, // Video format (e.g., MP4, MKV)
  },
  thumbnailUrl: {
    type: String, // Thumbnail image URL
  },
  resolutions: [
    {
      quality: {
        type: String, // Resolution quality, e.g., 360p, 480p, 720p
      },
      url: {
        type: String, // URL for the specific resolution
      },
    },
  ],
});

module.exports = mongoose.model("VideoDetails", videoDetailsSchema);
