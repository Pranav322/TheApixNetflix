const express = require("express");
const router = express.Router();
const reviewController = require("../controller/review.controller"); // Adjust the path as necessary

router.post("/api/reviews", reviewController.createReview);

router.get("/api/reviews", reviewController.getAllReviews);

router.get("/api/reviews/:id", reviewController.getReviewById);

router.get("/api/reviews/movie/:movieId", reviewController.getReviewsByMovieId);

router.put("/api/reviews/:id", reviewController.updateReview);

router.delete("/api/reviews/:id", reviewController.deleteReview);

module.exports = router;
