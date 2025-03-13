// Example of a simple Express server with MongoDB connection


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// middleware
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// listen for requests 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});