const { Discipline } = require("../models/DBschema");

// List all active disciplines (short)
const getAllDisciplines = async (req, res) => {
  try {
    const disciplines = await Discipline.find({ isActive: true }).select('name client isActive');
    res.json(disciplines);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get one discipline by id
const getDisciplineById = async (req, res) => {
  try {
    const discipline = await Discipline.findById(req.params.id);
    if (!discipline) return res.status(404).json({ message: "Discipline not found" });
    res.json(discipline);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new discipline
const createDiscipline = async (req, res) => {
  const { name, description, client } = req.body;

  try {
    const discipline = await Discipline.create({ name, description, client });
    res.status(201).json({
      message: "Discipline created successfully",
      discipline,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update discipline (PATCH)
const updateDiscipline = async (req, res) => {
  try {
    const updatedDiscipline = await Discipline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDiscipline) return res.status(404).json({ message: "Discipline not found" });

    res.json({
      message: "Discipline updated successfully",
      discipline: updatedDiscipline,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllDisciplines,
  getDisciplineById,
  createDiscipline,
  updateDiscipline,
};