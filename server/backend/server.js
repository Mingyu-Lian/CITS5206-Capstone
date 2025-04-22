const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/DBschema")
const mongoose = require("mongoose"); 
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const connectDB = require("./config/db"); // Import the connectDB function
const authRoutes = require("./routes/authRoutes");
const locoTypeRoutes = require("./routes/locoTypeRoutes");
const baselineRoutes = require("./routes/baselineRoutes");
const assetRoutes = require("./routes/assetRoutes");
const disciplineRoutes = require("./routes/disciplineRoutes");
const projectRoutes = require("./routes/projectRoutes");
const wmsRoutes = require("./routes/wmsRoutes");
const taskRoutes = require("./routes/taskRoutes");
const logRoutes = require("./routes/logRoutes");

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



const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hitachi Rail eWMS API test',
      version: '1.0.0',
      description: 'API documentation for your backend'
    },
  },
  apis: ['./routes/*.js'], // 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
// Mount routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use("/api/loco-types", locoTypeRoutes);
app.use("/api/baselines", baselineRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/disciplines", disciplineRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/wms", wmsRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/logs", logRoutes);


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));