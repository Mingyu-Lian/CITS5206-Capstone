const { Project } = require("../models/DBschema");

// List all projects (short list)
const getAllProjects = async (req, res) => {
  try {
    // Select key fields for a short overview
    const projects = await Project.find({}, "name startDate endDate createdAt updatedAt");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get project details
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ message: "Project created successfully", ...project.toObject() });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Project updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
