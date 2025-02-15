const Cast = require("../model/cast.model");

// Create a new cast member
exports.createCast = async (req, res) => {
  try {
    const { name, image, bio, movieId } = req.body;

    if (!name || !movieId) {
      return res.status(200).json({
        success: false,
        message: "Name and movie ID are required",
      });
    }

    const newCast = new Cast({ name, image, bio, movieId });
    const savedCast = await newCast.save();

    res.status(200).json({
      success: true,
      message: "Cast member created",
      cast: savedCast,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all cast members
exports.getAllCast = async (req, res) => {
  try {
    const cast = await Cast.find();

    if (!cast || cast.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cast members found",
        body: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Cast members retrieved",
      body: cast,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get cast members by movie ID
exports.getCastByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const cast = await Cast.find({ movieId });
    if (!cast || cast.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cast members found for this movie",
        body: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Cast members retrieved",
      body: cast,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Delete a cast member
exports.deleteCast = async (req, res) => {
  try {
    const { id } = req.params;
    const cast = await Cast.findByIdAndDelete(id);
    if (!cast) {
      return res.status(200).json({
        success: false,
        message: "Cast member not found",
        body: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Cast member deleted",
      body: cast,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update a cast member
exports.updateCast = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const cast = await Cast.findByIdAndUpdate(id, updatedData, { new: true });
    if (!cast) {
      return res.status(200).json({
        success: false,
        message: "Cast member not found",
        body: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Cast member updated",
      body: cast,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
