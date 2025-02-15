const express = require("express");
const router = express.Router();
const controller = require("../controller/episode.controller");

// Routes
router.post("/api/episodes", controller.addEpisode); // Add an episode
router.get("/api/episodes/:id", controller.getEpisodeById); // Get episode by ID
router.get("/api/getEpisodes", controller.getEpisodes);
router.get("/api/getMovieEpisodes/:movieId", controller.getEpisodesByMovieIdGrouped);
router.get("/api/episodesbymovie/:movieId", controller.getEpisodeByMovieId);
router.put("/api/episodes/:id", controller.updateEpisode); // Update episode by ID

module.exports = router;
