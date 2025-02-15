const Review = require("../model/review.model"); // Adjust the path as necessary

// POST: Create a new review
exports.createReview = async (req, res) => {
  try {
    const { userId, movieId, review, rating, userName } = req.body;

    if (!movieId || !userId || !review || !rating) {
      res.status(200).json({
        success: false,
        error: true,
        message: "please fill are the required filled",
      });
    }

    const newReview = new Review({ userId, movieId, review, rating,userName });
    await newReview.save();

    res.status(200).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET: Retrieve all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();

    if (!reviews.length) {
      return res.status(200).json({
        success: false,
        message: "No reviews found",
        body: null,
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET by ID: Retrieve a review by its ID
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(200).json({
        success: false,
        message: "Review not found",
        body: null,
      });
    }
    res.status(200).json({
      success: true,
      error: false,
      body: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      body: null,
    });
  }
};

// GET by Movie ID: Retrieve reviews by movie ID
exports.getReviewsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId });

    if (!reviews.length) {
      return res.status(200).json({
        success: false,
        message: "No reviews found for the given movie ID",
        body: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "review for specific movie fetched",
      body: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE: Update a review by its ID
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewText, rating } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { reviewText, rating },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE: Delete a review by its ID
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
