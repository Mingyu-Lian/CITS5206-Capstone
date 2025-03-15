const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/User")
const mongoose = require("mongoose"); 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/test";
console.log(MONGO_URI);
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Hello, Docker with MongoDB!");
});
app.listen(5000, () => console.log(`Server running on port 5000`));



  
 

//app.use("/api/auth", authRoutes);

