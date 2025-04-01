const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
 
const connectDB = async () => {
   
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/test"; // Default to a local MongoDB URI if not provided in environment variables
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected!");

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
        // Create an engineer user if it doesn't already exist
        const existingEngineer = await User.findOne({ Username: "engineer" });
        if (!existingEngineer) {
            try {
                const hashedPassword = await bcrypt.hash("123456", 10); // Replace with a secure password
                const engineerUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    Username: "engineer",
                    personName: "engineer",
                    email: "engineer@gmail.com",
                    passwordHash: hashedPassword,
                    role: "engineer",
                });
                await engineerUser.save();
                console.log("Engineer user created successfully!");
            } catch (error) {
                console.error("Error creating engineer user:", error);
            }
        }

        // Create a supervisor user if it doesn't already exist
        const existingSupervisor = await User.findOne({ Username: "supervisor" });
        if (!existingSupervisor) {
            try {
                const hashedPassword = await bcrypt.hash("123456", 10); // Replace with a secure password
                const supervisorUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    Username: "supervisor",
                    personName: "supervisor",
                    email: "supervisor@gmail.com",
                    passwordHash: hashedPassword,
                    role: "supervisor",
                });
                await supervisorUser.save();
                console.log("Supervisor user created successfully!");
            } catch (error) {
                console.error("Error creating supervisor user:", error);
            }
        }
    }
    catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;

