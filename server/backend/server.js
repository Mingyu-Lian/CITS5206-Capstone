const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Import the connectDB function
const authRoutes = require("./routes/authRoutes");

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB(); // Call the connectDB function to handle MongoDB connection and superuser creation

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Docker with MongoDB!");
});

app.use("/api/auth", authRoutes); // Authentication routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));