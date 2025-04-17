const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/DBschema");

// Login logic
const login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ Username: username });
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
          username: user.Username,
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
  // Expecting: { Username, personName, email, password, role }
  const { Username, personName, email, password, role } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user – note: _id, createdAt, and updatedAt are automatically handled by Mongoose
    const user = await User.create({ Username, personName, email, passwordHash, role });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    // Include createdAt in the response
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Registration error", error });
  }
};
    

// Get user details logic 
const getMe = async (req, res) => {
  // It is assumed that a middleware authenticates the token and sets req.user.
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve user", error });
  }
};

module.exports = { register, login, getMe };