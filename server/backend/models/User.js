const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // Unique user ID
    Username: { type: String, required: true, unique: true }, // Username
    personName: { type: String, required: true }, // Full name
    email: { type: String, required: true, unique: true }, // Login Email
    passwordHash: { type: String, required: true }, // Encrypted password
    role: { type: String, required: true }, // Role: admin, supervisor, engineer, etc.
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model("User", userSchema);

