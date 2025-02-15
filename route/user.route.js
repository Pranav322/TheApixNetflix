const express = require("express");
const routes = express.Router();
const userController = require("../controller/user");
const { verifyToken } = require("../middleware/auth");

// Public routes
routes.post("/auth/signup", userController.signup);
routes.post("/auth/signin", userController.signin);

// Protected routes
routes.get("/api/userList", verifyToken, userController.getUsers);
routes.post("/api/addMovieToUser", userController.addMovieToUser);
routes.get("/api/getprofile", verifyToken, userController.getprofile);

routes.get("/api/getDashboard", userController.getAdminDashboard);

module.exports = routes;
