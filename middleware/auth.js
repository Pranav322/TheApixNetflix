const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const verifyToken = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).send({
      success: false,
      error: "No token provided!",
      body: null,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        error: "Unauthorized!",
        body: null,
      });
    }

    // Ensure the decoded token has an ID
    if (!decoded.id) {
      return res.status(400).send({
        success: false,
        error: "Invalid token payload!",
        body: null,
      });
    }

    req.user_id = decoded.id; // Attach the user ID to the request object
    next();
  });
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

module.exports = { verifyToken };
