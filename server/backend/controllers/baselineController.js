const { Baseline } = require("../models/DBschema");

// Get all baselines with pagination
const getAllBaselines = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const baselines = await Baseline.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Baseline.countDocuments();
    res.json({
      baselines,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create new baseline (software)
const createBaseline = async (req, res) => {
  // Expecting: { softwareName, softwareVersion (array), description }
  const { softwareName, softwareVersion, description } = req.body;
  try {
    const baseline = await Baseline.create({ softwareName, softwareVersion, description });
    res.status(201).json({
      message: "Baseline created successfully",
      _id: baseline._id,
      softwareName: baseline.softwareName,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a specific baseline by id
const getBaselineById = async (req, res) => {
  try {
    const baseline = await Baseline.findById(req.params.id);
    if (!baseline) return res.status(404).json({ message: "Not found" });
    res.json(baseline);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a baseline
const updateBaseline = async (req, res) => {
  try {
    await Baseline.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Baseline updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a baseline
const deleteBaseline = async (req, res) => {
  try {
    await Baseline.findByIdAndDelete(req.params.id);
    res.json({ message: "Baseline deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllBaselines,
  createBaseline,
  getBaselineById,
  updateBaseline,
  deleteBaseline,
};
