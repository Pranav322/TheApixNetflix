const express = require("express");
const router = express.Router();
const castController = require("../controller/cast.controller");

router.post("/api/casts", castController.createCast);
router.get("/api/getCasts", castController.getAllCast);
router.get("/api/castsbymovie/:movieId", castController.getCastByMovieId);
router.delete("/api/casts/:id", castController.deleteCast);
router.put("/api/casts/:id", castController.updateCast);

module.exports = router;
 