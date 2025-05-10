// controllers/taskController.js
const { Task, Log } = require("../models/DBschema");

// GET /api/tasks
const getAllTasks = async (req, res) => {
  try {
    const filter = { "meta.isActive": true };
    if (req.query.WMSid) filter["meta.projectId"] = req.query.WMSid;
    if (req.query.taskID) filter._id = req.query.taskID;

    const userRole = req.user.role;
    const userId = req.user._id;

    if (userRole !== "admin") {
      filter.$or = [
        { "meta.assignedSupervisor": userId },
        { "meta.assignedEngineer": userId }
      ];
    }

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err });
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.meta.isActive === false) {
      return res.status(404).json({ message: "Task not found or inactive" });
    }

    const userRole = req.user.role;
    const userId = req.user._id.toString();
    const isSupervisor = task.meta.assignedSupervisor?.map(id => id.toString()).includes(userId);
    const isEngineer = task.meta.assignedEngineer?.map(id => id.toString()).includes(userId);

    if (userRole !== "admin" && !(isSupervisor || isEngineer)) {
      return res.status(403).json({ message: "Forbidden: Not assigned to this task" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch task", error: err });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Forbidden: Only admin can create tasks" });
    }

    const task = await Task.create(req.body);
    res.status(201).json({ message: "Task created", _id: task._id });
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", error: err });
  }
};

// PATCH /api/tasks/:id
const patchTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.meta.isActive === false) {
      return res.status(404).json({ message: "Task not found or inactive" });
    }

    const userRole = req.user.role;
    const userId = req.user._id.toString();
    const isSupervisor = task.meta.assignedSupervisor?.map(id => id.toString()).includes(userId);
    const isEngineer = task.meta.assignedEngineer?.map(id => id.toString()).includes(userId);

    if (userRole !== "admin" && !(isSupervisor || isEngineer)) {
      return res.status(403).json({ message: "Forbidden: You are not assigned to this task" });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    await Log.create({
      userId: req.user._id,
      action: "Task Patched",
      locoID: null,
      details: `Task ${req.params.id} updated.`,
      actionTime: new Date(),
      ip: req.ip || null
    });

    res.json({ message: "Task updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Patch failed", error: err });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  patchTask
};


