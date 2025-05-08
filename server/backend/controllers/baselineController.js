const { Baseline } = require("../models/DBschema");

// Get all baselines  
const getAllBaselines = async (req, res) => {
  try {
    const baselines = await Baseline.find(); // Fetch all baselines without pagination
    res.json({
      baselines,
      total: baselines.length, // Return the total count of baselines
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
const addVersion = async (req, res) => {
  const { baselineId } = req.params;
  const { version, note } = req.body;

  try {
    const baseline = await Baseline.findById(baselineId);
    if (!baseline) {
      return res.status(404).json({ message: "Baseline not found" });
    }

    const newVersion = {
      versionId: `v${baseline.versions.length + 1}`,
      version,
      note,
      createdBy: req.user._id,
      createdAt: new Date(),
      isActive: true,
    };

    baseline.versions.push(newVersion);
    await baseline.save();

    res.status(201).json({ message: "Version added", version: newVersion });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const updateVersion = async (req, res) => {
  const { baselineId, versionId } = req.params;
  const { version, note, isActive, usageAdd } = req.body;

  try {
    const baseline = await Baseline.findById(baselineId);
    if (!baseline) {
      return res.status(404).json({ message: "Baseline not found" });
    }

    const versionToUpdate = baseline.versions.find(v => v.versionId === versionId);
    if (!versionToUpdate) {
      return res.status(404).json({ message: "Version not found" });
    }

    if (version) versionToUpdate.version = version;
    if (note) versionToUpdate.note = note;
    if (isActive !== undefined) versionToUpdate.isActive = isActive;

    if (usageAdd) {
      versionToUpdate.usageHistory.push({
        usedInLoco: [usageAdd.locoId],
        userId: req.user._id,
        usedAt: new Date(),
      });
    }

    versionToUpdate.updatedAt = new Date();
    await baseline.save();

    res.status(200).json({ message: "Version updated", version: versionToUpdate });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
module.exports = {
  getAllBaselines,
  createBaseline,
  getBaselineById,
  updateBaseline,
  addVersion,
  updateVersion,
};
