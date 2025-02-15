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
  try {
    const {
      episodeName,
      seasonName,
      seasonNumber,
      movieId,
      videoDetails
    } = req.body;

    // Validate required fields
    if (!episodeName || !seasonName || !seasonNumber || !movieId || !videoDetails.duration) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Create new episode
    const newEpisode = new Episode({
      episodeName,
      seasonName,
      seasonNumber,
      movieId,
      videoDetails
    });

    // Save episode to database
    const savedEpisode = await newEpisode.save();

    return res.status(201).json({
      success: true,
      message: "Episode added successfully",
      data: savedEpisode
    });

  } catch (error) {
    console.error("Error in addEpisode:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding episode",
      error: error.message
    });
  }
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

// Get episodes grouped by season for a movie
exports.getEpisodesByMovieIdGrouped = async (req, res) => {
  const { movieId } = req.params;

  try {
    const episodes = await Episode.find({ movieId })
      .sort({ seasonNumber: 1 }) // Sort by season number
      .lean(); // Convert to plain JavaScript objects

    if (!episodes.length) {
      return res.status(200).json({
        success: true,
        message: "No episodes found for this movie.",
        seasons: {},
      });
    }

    // Group episodes by season
    const groupedEpisodes = episodes.reduce((acc, episode) => {
      const seasonKey = `Season ${episode.seasonNumber}`;
      if (!acc[seasonKey]) {
        acc[seasonKey] = {
          seasonName: episode.seasonName,
          episodes: []
        };
      }
      acc[seasonKey].episodes.push(episode);
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      message: "Episodes retrieved successfully",
      seasons: groupedEpisodes,
    });
  } catch (error) {
    console.error("Error in getEpisodesByMovieIdGrouped:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Server error while fetching episodes.",
    });
  }
};
