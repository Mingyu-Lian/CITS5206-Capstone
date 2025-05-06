const { Project } = require("../models/DBschema");

// List all projects (short list)

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find(
      { isActive: true },    // Filter to only include active projects
      "name startDate endDate createdAt updateHistory isActive" 
    );
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
    const { name, description, startDate, endDate } = req.body;
    const project = new Project({
      name,
      description,
      startDate,
      endDate,
      createdBy: req.user._id,  // the user creating the project, Automatically set by middleware
    });
    await project.save();
    res.status(201).json({ message: "Project created successfully", project: project.toObject() });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update project (including isActive/delete)
// Note: The updateHistory field is automatically updated in the schema
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // patch the project with the updates
    Object.keys(updates).forEach(key => {
      project[key] = updates[key];
    });

    // automatically add the userId and updatedAt to the updateHistory
    project.updateHistory.push({
      userId: req.user._id,
      updatedAt: new Date()
    });

    await project.save();

    res.json({ message: "Project updated successfully", project: project.toObject() });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
};
