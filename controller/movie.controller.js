const Movie = require("../model/movie.model");
const Cast = require("../model/cast.model");
const Episode = require("../model/episodes.model");
const Review = require("../model/review.model");
const VideoDetail = require("../model/video.model");

const movieWithAllData = async (movies) => {
  // Check if movies is an array or a single object
  const isArray = Array.isArray(movies);
  const moviesArray = isArray ? movies : [movies];

  const moviesWithDetails = await Promise.all(
    moviesArray.map(async (movie) => {
      const casts = await Cast.find({ movieId: movie._id }).select(
        "name image bio"
      );
      const episodes = await Episode.find({ movieId: movie._id }).select(
        "episode_url episode_time"
      );

      const review = await Review.find({ movieId: movie._id });
      const videoDetails = await VideoDetail.find({ movieId: movie._id });

      return {
        ...movie._doc,
        casts,
        episodes,
        reviews: review,
        videoDetails: videoDetails,
      };
    })
  );

  // Return a single object if the input was a single object
  return isArray ? moviesWithDetails : moviesWithDetails[0];
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();

    if (!movies.length) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No movies found",
      });
    }

    // Transform the response to include video details
    const moviesWithDetails = await Promise.all(movies.map(async (movie) => {
      // Find video details for this movie
      const videoDetails = await VideoDetail.findOne({ movieId: movie.movieId });
      const casts = await Cast.find({ movieId: movie.movieId });
      const episodes = await Episode.find({ movieId: movie.movieId });
      const reviews = await Review.find({ movieId: movie.movieId });
      
      return {
        ...movie._doc,
        thumbnailUrl: videoDetails?.thumbnailUrl || movie.thumbnailUrl,
        trailerUrl: videoDetails?.trailerUrl,
        videoDetails: videoDetails ? [videoDetails] : [],
        casts: casts || [],
        episodes: episodes || [],
        reviews: reviews || []
      };
    }));

    res.status(200).json({
      success: true,
      error: false,
      message: "Movies retrieved successfully",
      movies: moviesWithDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

exports.getOnlyMovies = async (req, res) => {
  try {
    // Add sort to get latest movies first
    const movies = await Movie.find().sort({ _id: -1 });

    if (!movies.length) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No movies found",
      });
    }

    // Log to debug
    console.log("Found movies count:", movies.length);
    
    res.status(200).json({
      success: true,
      error: false,
      message: "Movies retrieved successfully",
      movies: movies,
    });
  } catch (error) {
    console.error("Error in getOnlyMovies:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

exports.addMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    
    res.status(201).json({
      success: true,
      message: "Movie added successfully",
      movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add movie",
      error: error.message,
    });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Movie not found",
      });
    }

    const movieWithDetail = await movieWithAllData(movie);

    res.status(200).json({
      success: true,
      error: false,
      message: "Movie details retrieved successfully",
      movieWithDetail,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, time, releaseDate } = req.body;

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { title, description, time, releaseDate },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Movie updated successfully",
      movie: updatedMovie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

exports.deleteMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the movie
    const deletedMovie = await Movie.findByIdAndDelete(id);

    // If movie not found
    if (!deletedMovie) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Movie deleted successfully",
      movie: deletedMovie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

exports.searchMovies = async (req, res) => {
  d;
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Query parameter is required",
      });
    }

    // Search movies based on title or description
    const movies = await Movie.find({
      $or: [{ title: { $regex: query, $options: "i" } }],
    });

    if (!movies.length) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No movies found matching your query",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Movies retrieved successfully",
      movies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};
