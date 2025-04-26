const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/DBschema");

// Login logic
const login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username: username });
      if (!user) return res.status(400).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "1h" }
      );
  
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // Register logic
const register = async (req, res) => {
  // Expecting: { username, personName, email, password, role }
  const { username, personName, email, password, role } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user – note: _id, createdAt, and updatedAt are automatically handled by Mongoose
    const user = await User.create({ username, personName, email, passwordHash, role });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    // Include createdAt in the response
    res.status(201).json({ token, user });
     
    // Include createdAt in the response
    
  } catch (error) {
    res.status(500).json({ message: "Registration error", error });
  }
};
    
const logout = async (req, res) => {
  try {
    // Clear the token from the client by setting an expired cookie
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error during logout", error });
  }
};
// Get all users logic
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database, excluding sensitive fields like passwordHash
    const users = await User.find().select("-passwordHash");

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve users", error });
  }
};

// Get user details logic 
const getMe = async (req, res) => {
  try {
    // Use the user object already attached by the authenticate middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user details in a consistent format
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        personName: user.personName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve user", error });
  }
};

module.exports = { register, login, getMe,logout,getAllUsers };