const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const {
    User,
    LocoType,
    Baseline,
    Asset,
    Project,
    WMS,
    Task,
    Discipline,
    Log
  } = require("../models/DBschema");
const connectDB = async () => {
   
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/test"; // Default to a local MongoDB URI if not provided in environment variables
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected!");
          // Optionally clear existing data before seeding (remove if not needed)
        await Promise.all([
        User.deleteMany({}),
        LocoType.deleteMany({}),
        Baseline.deleteMany({}),
        Asset.deleteMany({}),
        Project.deleteMany({}),
        WMS.deleteMany({}),
        Task.deleteMany({}),
        Discipline.deleteMany({}),
        Log.deleteMany({})
        ]);
        console.log("Existing data cleared.");

        // Create a superuser if it doesn't already exist
        const existingSuperUser = await User.findOne({ Username: "admin" });
        console.log(existingSuperUser);
        if (!existingSuperUser) {
            try{
            const hashedPassword = await bcrypt.hash("123456", 10); // Replace "superpassword" with a secure password
            const superUser = new User({
                _id: new mongoose.Types.ObjectId(),
                Username: "admin",
                personName: "admin",
                email: "admin@gmail.com",
                passwordHash: hashedPassword,
                role: "admin",
            });
            await superUser.save();
            console.log("admin user created successfully!");
        } catch (error) {
            console.error("Error creating admin user:", error);
        }
        }
         // Path to your JSON file containing sample data.
         // Make sure sampleData.json is in the same folder as this script or adjust the path accordingly.
        const dataPath = path.join(__dirname, "../sample.json");
        const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        await Promise.all([
            LocoType.insertMany(jsonData.locoTypes),
            Baseline.insertMany(jsonData.baselines),
            Asset.insertMany(jsonData.assets),
            Project.insertMany(jsonData.projects),
            WMS.insertMany(jsonData.wms),
            Task.insertMany(jsonData.tasks),
            Discipline.insertMany(jsonData.disciplines),
            Log.insertMany(jsonData.logs)
          ]);
      
          console.log("Sample data seeded successfully!");

       
    }
    catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;

