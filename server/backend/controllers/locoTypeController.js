const { LocoType } = require("../models/DBschema");

// List all loco types (filter by isActive)
const getAllLocoTypes = async (req, res) => {
  try {
    const locoTypes = await LocoType.find({ isActive: true });
    res.json({ locoTypes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Get a specific loco type by id (not filter by isActive)
const getLocoTypeById = async (req, res) => {
  try {
    const locoType = await LocoType.findById(req.params.id);
    if (!locoType) return res.status(404).json({ message: "Not found" });
    res.json(locoType);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new loco type (set isActive to true as default)
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

// Update a loco type (including isActive/delete)

const updateLocoType = async (req, res) => {
  try {
    const update = await LocoType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!update) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Loco type updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



// Export the functions to be used in the routes
module.exports = {
  getAllLocoTypes,
  getLocoTypeById,
  createLocoType,
  updateLocoType,
};