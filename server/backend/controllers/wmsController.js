const { WMS } = require("../models/DBschema");

// List WMS files, optionally filtered by isActive and locoId
const getAllWMS = async (req, res) => {
  const filter = {};
  if (req.query.isActive) filter.isActive = req.query.isActive;
  if (req.query.locoId) filter.locoId = req.query.locoId;
  try {
    const wmsList = await WMS.find(filter);
    res.json(wmsList);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a specific WMS file by id
const getWMSById = async (req, res) => {
  try {
    const wms = await WMS.findById(req.params.id);
    if (!wms) return res.status(404).json({ message: "Not found" });
    res.json(wms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new WMS
const createWMS = async (req, res) => {
  // Expecting body to include: document_id, name, projectId, version, etc.
  try {
    const wms = await WMS.create(req.body);
    res.status(201).json({ message: "WMS created successfully", ...wms.toObject() });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update WMS (for Supervisor/Engineer)
const updateWMS = async (req, res) => {
  try {
    await WMS.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "WMS updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete WMS (Admin only)
const deleteWMS = async (req, res) => {
  try {
    await WMS.findByIdAndDelete(req.params.id);
    res.json({ message: "WMS file deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllWMS,
  getWMSById,
  createWMS,
  updateWMS,
  deleteWMS,
};

