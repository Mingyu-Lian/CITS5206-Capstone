const { Discipline } = require("../models/DBschema");

// List all disciplines
const getAllDisciplines = async (req, res) => {
  try {
    const disciplines = await Discipline.find();
    res.json(disciplines);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get one discipline by id
const getDisciplineById = async (req, res) => {
  try {
    const discipline = await Discipline.findById(req.params.id);
    if (!discipline) return res.status(404).json({ message: "Not found" });
    res.json(discipline);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new discipline
const createDiscipline = async (req, res) => {
    const { name, description } = req.body;
  
    try {
      const discipline = await Discipline.create({ name, description });
      res.status(201).json({
        message: "Discipline created successfully",
        _id: discipline._id,
        name: discipline.name,
        description: discipline.description,
      });
    } catch (error) {
      console.error("Error creating discipline:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
// Update discipline
const updateDiscipline = async (req, res) => {
  try {
    await Discipline.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Discipline updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete discipline
const deleteDiscipline = async (req, res) => {
  try {
    await Discipline.findByIdAndDelete(req.params.id);
    res.json({ message: "Discipline deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllDisciplines,
  getDisciplineById,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
};
