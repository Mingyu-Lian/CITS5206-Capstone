const { Task, Log } = require("../models/DBschema");

// List tasks by WMS id or task id query parameter
const getAllTasks = async (req, res) => {
  const filter = {};
  if (req.query.WMSid) filter.parentsWMS = req.query.WMSid;
  if (req.query.taskID) filter._id = req.query.taskID;
  try {
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get task detail (with additional details like subtasks)
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ message: "Task created successfully", _id: task._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body);

    await Log.create({
      userId: req.user._id, // User performing the action (from authenticate middleware)
      action: "Task Updated",
      locoID: updatedTask.locoID || null, // If the task is associated with a locomotive type
      details: `Task with ID ${req.params.id} was updated.`,
      actionTime: new Date(),
      ip: req.ip|| null,// IP address  
    });

    res.json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete task (and return deleted task if needed)
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

