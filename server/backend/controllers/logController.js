const { Log } = require("../models/DBschema");

const getAllLogs = async (req, res) => {
  const { userid, page = 1, limit = 20, locoID } = req.query;
  const filter = {};

  // if is not admin, filter by userId (only see their own logs)
  if (req.user.role !== "admin") {
    filter.userId = req.user._id;
  } else {
    // admin can see all logs
    // if have userid, filter by userid
    if (userid) filter.userId = userid;
  }

  // if have locoID, filter by locoID
  if (locoID) filter.locoID = locoID;

  try {
    const logs = await Log.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ actionTime: -1 }); // 
    // Sort by actionTime in descending order

    const total = await Log.countDocuments(filter);
    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const createLog = async (req, res) => {
  try {
    const log = await Log.create(req.body);
    res.status(201).json({ message: "Log created successfully", log });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateLog = async (req, res) => {
  try {
    await Log.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Log record updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

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

