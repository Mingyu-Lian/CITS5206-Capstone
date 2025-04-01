const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// LOGIN User
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ Username: username });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "your_jwt_secret", // Replace with a secure secret
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
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
