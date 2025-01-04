const express = require("express");
const routes = express.Router();
const userController = require("../controller/whishlist.controller");
const { verifyToken } = require("../middleware/auth");

// Public routes
routes.post("/api/add/whishlist", verifyToken, userController.addToWishlist);

// Protected routes
routes.get("/api/get/wishlist/byuser", verifyToken, userController.getWishlist);
routes.delete(
  "/api/delete/wishlist/:id",
  verifyToken,
  userController.deleteWishlistById
);

module.exports = routes;
