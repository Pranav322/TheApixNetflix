const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

const app = express();
const userRoute = require("./route/user.route");
const movieRoute = require("./route/movie.route");
const episode = require("./route/episode.route");
const wishlist = require("./route/wishlist.route");
const castRoute = require("./route/cast.route");
const purchasedRoute = require("./route/purchased.route");
const reviewRoute = require("./route/review.route")
const videoRoutes = require('./route/video.routes');
const imageRoutes = require('./route/image.router');
const videoDetailRoute = require('./route/videoDetail.route'); 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use(userRoute);
app.use(movieRoute);
app.use(episode);
app.use(wishlist);
app.use(castRoute);
app.use(purchasedRoute);
app.use(reviewRoute)
app.use('/api/videos', videoRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/videoDetail', videoDetailRoute);


app.get("/", (req, res) => {
  res.send("Welcome to Crypto Web");
});

// Set the PORT dynamically for Heroku
const PORT = process.env.PORT || 8000;

// MongoDB Connection and Server Startup
mongoose
  .connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database has been connected");
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process if the database fails to connect
  });
