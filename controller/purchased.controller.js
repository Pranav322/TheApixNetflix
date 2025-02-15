const purchasedModel = require("../model/purchased.model");
const movieModel = require("../model/movie.model");
const Episode = require("../model/purchased.model");

// POST API to handle new purchases
exports.createPurchase = async (req, res) => {
  try {
    const { movieId, userId } = req.body;
    if (!movieId || !userId) {
      return res.status(200).json({
        success: false,
        error: true,
        message: "Both movieId and userId are required",
      });
    }

    const newPurchase = await purchasedModel.create({ movieId, userId });

    res.status(200).json({
      success: true,
      error: false,
      message: "Purchase created successfully",
      body: newPurchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    }); // Handle errors
  }
};

// GET API to retrieve purchases by user ID including movies and their episodes
exports.getPurchasesByUserId = async (req, res) => {
  try {
    const userId = req.user_id;
    const purchases = await purchasedModel.find({ userId });

    if (!purchases.length) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No purchases found for the given user ID",
      });
    }

    const moviesWithEpisodes = await Promise.all(
      purchases.map(async (purchase) => {
        const movie = await movieModel.findById(purchase.movieId);
        console.log(movie._id);
        const episodes = await Episode.find({ movieId: movie._id });

        return { ...movie._doc, episodes };
      })
    );

    res.status(200).json({
      success: true,
      error: false,
      message: "Purchases retrieved successfully",
      body: {
        data: moviesWithEpisodes,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};
