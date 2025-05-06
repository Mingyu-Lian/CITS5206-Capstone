const { WorkTable } = require("../models/DBschema");
// Get all WorkTables
const getAllWorkTables = async (req, res) => {
    try {
      const workTables = await WorkTable.find();
      res.json(workTables);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
// Create a new WorkTable
const createWorkTable = async (req, res) => {
  try {
    const workTable = await WorkTable.create(req.body);
    res.status(201).json({ message: "WorkTable created successfully", workTable });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a WorkTable by ID
const getWorkTableById = async (req, res) => {
  try {
    const workTable = await WorkTable.findById(req.params.id);
    if (!workTable) {
      return res.status(404).json({ message: "WorkTable not found" });
    }
    res.json(workTable);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a WorkTable
const updateWorkTable = async (req, res) => {
  try {
    const updatedWorkTable = await WorkTable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedWorkTable) {
      return res.status(404).json({ message: "WorkTable not found" });
    }
    res.json({ message: "WorkTable updated successfully", updatedWorkTable });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a WorkTable
const deleteWorkTable = async (req, res) => {
  try {
    const deletedWorkTable = await WorkTable.findByIdAndDelete(req.params.id);
    if (!deletedWorkTable) {
      return res.status(404).json({ message: "WorkTable not found" });
    }
    res.json({ message: "WorkTable deleted successfully", deletedWorkTable });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
    createWorkTable,
    getWorkTableById,
    updateWorkTable,
    deleteWorkTable,
    getAllWorkTables,  
  };