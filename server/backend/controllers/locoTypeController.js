const { LocoType } = require("../models/DBschema");

// List all loco types
const getAllLocoTypes = async (req, res) => {
  try {
    const locoTypes = await LocoType.find();
    res.json(locoTypes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a specific loco type by id
const getLocoTypeById = async (req, res) => {
  try {
    const locoType = await LocoType.findById(req.params.id);
    if (!locoType) return res.status(404).json({ message: "Not found" });
    res.json(locoType);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new loco type
const createLocoType = async (req, res) => {
  const { name, description } = req.body;
  try {
    const locoType = await LocoType.create({ name, description });
    res.status(201).json({
      message: "Loco type created successfully",
      _id: locoType._id,
      name: locoType.name,
      description: locoType.description,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a loco type
const updateLocoType = async (req, res) => {
  try {
    await LocoType.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Loco type updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a loco type
const deleteLocoType = async (req, res) => {
  try {
    await LocoType.findByIdAndDelete(req.params.id);
    res.json({ message: "Loco type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllLocoTypes,
  getLocoTypeById,
  createLocoType,
  updateLocoType,
  deleteLocoType,
};
