const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/User")
const mongoose = require("mongoose"); 
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
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
app.listen(5001, () => console.log(`Server running on port 5001`));


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hitachi Rail eWMS API',
      version: '1.0.0',
      description: 'API documentation for your backend'
    },
  },
  apis: ['./routes/*.js'], // 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));