const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const Movie = require("../model/movie.model");

exports. addMovieToUser = async (req, res) => {
  const { userId, movieId } = req.body; // Expecting userId and movieId in the request body

  if (!userId || !movieId) {
    return res.status(400).json({ message: "User ID and Movie ID are required." });
  }

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the movie to make sure it exists
    const movie = await Movie.findOne({ movieId });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    // Check if the movie is already purchased by the user
    if (user.purchasedMovies.includes(movieId)) {
      return res.status(400).json({ message: "Movie already purchased by the user." });
    }

    // Add the movie ID to the user's purchasedMovies array
    user.purchasedMovies.push(movieId);
    
    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "Movie successfully added to user's purchased list." });
  } catch (error) {
    console.error("Error adding movie to user:", error);
    return res.status(500).json({ message: "Server error." });
  }
};


exports.signup = async (req, res) => {
  try {
    const { user_name, email, password, contact, user_type } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Email already exists",
      });
    }

    const NewUserData = new User({
      user_name,
      email,
      password,
      contact,
      user_type,
    });

    const token = jwt.sign({ id: NewUserData._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    await NewUserData.save();

    res.status(200).json({
      success: true,
      error: false,
      message: "User sign up successfully",
      user: NewUserData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server Error",
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const UserExist = await User.findOne({ email });

    if (!UserExist) {
      return res.status(200).json({
        success: false,
        error: true,
        message: "User not found for this email",
      });
    }

    const token = jwt.sign({ id: UserExist._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    if (password != UserExist.password) {
      return res.status(200).json({
        success: false,
        error: true,
        message: "password did not match ",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "user login successfully",
      user: UserExist,
      token,
    });
  } catch {
    console.log(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server Error",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const UserList = await User.find();

    if (!UserList) {
      res.status(200).json({
        success: false,
        error: true,
        message: "No User Found",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "User data",
      body: UserList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server Error",
    });
  }
};

exports.getprofile = async (req, res) => {
  try {
    const user_id = req.user_id;
    const user = await User.findById(user_id).select("-password");

    if (!user) {
      return res.status(200).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "User profile",
      body: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server Error",
    });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();

    const totalUsers = await User.countDocuments();

    // Get the total revenue (assuming revenue is stored as 'amount' in Transaction model)
    // const totalRevenue = await Transaction.aggregate([
    //   { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }, // Sum up the 'amount' field
    // ]);

    // const revenue = totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0;

    return res.status(200).json({
      success: true,
      error: "Dashboard data",
      body: {
        totalMovies,
        totalUsers,
      },

      // totalRevenue: revenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching admin dashboard data.",
      body: null,
    });
  }
};
