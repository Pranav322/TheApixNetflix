const Wishlist = require("../model/whishlist.model");
const Movie = require("../model/movie.model");

// Add a movie to the wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user_id; 

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required",
      });
    }

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Check if the user already has a wishlist
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, movie_id: [movieId] });
    } else {
      // Prevent duplicates
      if (wishlist.movie_id.includes(movieId)) {
        return res.status(400).json({
          success: false,
          message: "Movie already in wishlist",
        });
      }
      wishlist.movie_id.push(movieId);
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Movie added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteWishlistById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Wishlist ID is required",
      });
    }

    // Find and delete the wishlist by ID
    const deletedWishlist = await Wishlist.findByIdAndDelete(id);

    if (!deletedWishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist deleted successfully",
      wishlist: deletedWishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get the user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user_id;

    // Find the user's wishlist and populate movie details
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(200).json({
        success: false,
        message: "No movie found in wishlist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully",
      wishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
