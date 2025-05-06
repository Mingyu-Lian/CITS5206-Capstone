const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User,Discipline } = require("../models/DBschema");

// Login logic
const login = async (req, res) => {
    const { username, password,selectedDiscipline} = req.body;
  
    try {
      const user = await User.findOne({ username: username }).populate("disciplines");
      if (!user) return res.status(400).json({ message: "User not found" });
        // Check if the password matches
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

       // Check if the selected discipline exists in the user's disciplines
      const disciplineDoc = user.discipline.find(d => d.name === selectedDiscipline);
      if (!disciplineDoc) {
        return res.status(400).json({ message: "Selected discipline is not associated with the user" });
      }
      
      const token = jwt.sign(
        { id: user._id, role: user.role,discipline: selectedDiscipline},
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "1h" }
      );
  
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          selectedDiscipline:disciplineDoc.name,
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
  const { username, personName, email, password, role, discipline } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Find disciplines by name
    const disciplineDocs = await Discipline.find({ name: { $in: discipline } });
    if (disciplineDocs.length !== discipline.length) {
      return res.status(400).json({ message: "One or more disciplines not found" });
    }
    const disciplineIds = disciplineDocs.map(d => d._id);
    // Create user – note: _id, createdAt, and updatedAt are automatically handled by Mongoose
    const user = await User.create({ username, personName, email, passwordHash, role, discipline: disciplineIds});
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    // Include createdAt in the response
    res.status(201).json({
      token,
      user,
    });
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
        disciplines: user.discipline,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve user", error });
  }
};
const updateUser = async (req, res) => {
  const updates = req.body; // All fields to be updated are passed in the request body

  try {
    // Ensure the user is authenticated and their ID is available
    const userId = req.params.id; // Get the user ID from the request parameters

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields dynamically
    for (const key in updates) {
      if (key === "password") {
        // Hash the password before updating
        const passwordHash = await bcrypt.hash(updates[key], 10);
        user.passwordHash = passwordHash;
      } else if (user[key] !== undefined) {
        // Update only fields that exist in the user schema
        user[key] = updates[key];
      }
    }
    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        username: user.username,
        personName: user.personName,
        email: user.email,
        role: user.role,
        discipline: user.discipline,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Unable to update user", error });
  }
};

const updateProfile = async (req, res) => {
  const { password } = req.body; // Extract the password from the request body

  try {
    // Ensure the user is authenticated and their ID is available
    const userId = req.user._id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required to update" });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Unable to update password", error });
  }
};
module.exports = { register, login, getMe, logout, getAllUsers, updateUser,updateProfile };
 