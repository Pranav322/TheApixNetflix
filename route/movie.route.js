const express = require("express");
const router = express.Router();
const movieController = require("../controller/movie.controller");
const { verifyToken } = require("../middleware/auth");

// Routes for movies
router.post("/api/add/movie", movieController.addMovie); // Add a movie
router.get("/api/get/movies", movieController.getMovies); // Get all movies
router.get("/api/get/only-movies", movieController.getOnlyMovies); // Get all movies
router.get("/api/get/movies/:id", movieController.getMovieById); // Get movie by ID
router.put("/api/update/movies/:id", verifyToken, movieController.updateMovie);
router.delete(
  "/api/delete/movie/:id",
  verifyToken,
  movieController.deleteMovieById
);
router.get("/api/search/movies", movieController.searchMovies);

module.exports = router;
