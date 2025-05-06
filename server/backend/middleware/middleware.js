const jwt = require("jsonwebtoken");
const { User } = require("../models/DBschema");

// Middleware to authenticate the user
const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Authorization Header:", req.header("Authorization"));
  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to the request object
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error });
  }
};

// Middleware to authorize based on roles
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
     // Check if the user's role is in the allowedRoles array
     if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
  };
};

module.exports = { authenticate, authorize };