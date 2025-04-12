const { Log } = require("../models/DBschema");

// List logs with optional user filter and pagination
const getAllLogs = async (req, res) => {
  const { userid, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (userid) filter.userId = userid;
  try {
    const logs = await Log.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Log.countDocuments(filter);
    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new log (accessible to all users)
const createLog = async (req, res) => {
  try {
    const log = await Log.create(req.body);
    res.status(201).json({ message: "Log created successfully", log });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update log (Admin only)
const updateLog = async (req, res) => {
  try {
    await Log.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Log record updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete log (Admin only)
const deleteLog = async (req, res) => {
  try {
    await Log.findByIdAndDelete(req.params.id);
    res.json({ message: "Log record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllLogs,
  createLog,
  updateLog,
  deleteLog,
};
