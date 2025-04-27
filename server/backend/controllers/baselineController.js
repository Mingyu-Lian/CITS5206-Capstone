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
  // Expecting: { softwareId, softwareName, description, versions }
  const { softwareId, softwareName, description, versions } = req.body;
  try {
    const baseline = await Baseline.create({
      softwareId,
      softwareName,
      description,
      isActive: true,
      versions,
    });
    res.status(201).json({
      message: "Baseline created successfully",
      baseline,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a specific baseline by id
const getBaselineById = async (req, res) => {
  try {
    const baseline = await Baseline.findById(req.params.id);
    if (!baseline) return res.status(404).json({ message: "Baseline not found" });
    res.json(baseline);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a baseline
const updateBaseline = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const baseline = await Baseline.findByIdAndUpdate(id, updates, { new: true });
    if (!baseline) return res.status(404).json({ message: "Baseline not found" });

    res.json({ message: "Baseline updated successfully", baseline });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {
  getAllBaselines,
  createBaseline,
  getBaselineById,
  updateBaseline,
};
