const Episode = require("../model/episodes.model");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.addEpisode = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: true,
        message: "File upload failed",
      });
    }

    try {
      const { episode_url, episode_time, movieId } = req.body;
      const file = req.file;

      if (!episode_url || !file) {
        return res.status(200).json({
          success: false,
          error: true,
          message: "Episode URL, time, and file are required fields",
        });
      }

      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto", // Automatically detect the file type
      });

      const newEpisode = new Episode({
        episode_url: result.secure_url, // Use the Cloudinary URL
        episode_time,
        movieId,
      });

      await newEpisode.save();

      res.status(201).json({
        success: true,
        error: false,
        message: "Episode added successfully",
        episode: newEpisode,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: true,
        message: "Internal server error",
      });
    }
  });
};

exports.getEpisodes = async (req, res) => {
  try {
    const episodes = await Episode.find();

    if (!episodes.length) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No episodes found",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Episodes retrieved successfully",
      episodes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

// Get Episode Details
exports.getEpisodeById = async (req, res) => {
  try {
    const { id } = req.params;

    const episode = await Episode.findById(id);

    if (!episode) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Episode not found",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Episode details retrieved successfully",
      episode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

// Update Episode Details
exports.updateEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const { episode_url, episode_time, movieId } = req.body;

    const updatedEpisode = await Episode.findByIdAndUpdate(
      id,
      { episode_url, episode_time, movieId },
      { new: true }
    );

    if (!updatedEpisode) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Episode not found",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Episode updated successfully",
      episode: updatedEpisode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

// Get episode by movie ID
exports.getEpisodeByMovieId = async (req, res) => {
  const { movieId } = req.params;
  console.log("Received movieId:", movieId);

  try {
    const episodes = await Episode.find({ movieId: movieId });
    console.log("Query result:", episodes);

    if (!episodes.length) {
      return res.status(200).json({
        success: true,
        message: "No episodes found for this movie.",
        body: episodes,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Episodes retrieved successfully",
      episodes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Server error while fetching episodes.",
    });
  }
};
