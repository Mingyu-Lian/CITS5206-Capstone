const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { authenticate, authorize } = require("../middleware/middleware");
/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Operations related to tasks
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: List tasks by WMS id or task id (using query parameters)
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: WMSid
 *         schema:
 *           type: string
 *         description: Filter tasks by parent WMS id
 *       - in: query
 *         name: taskID
 *         schema:
 *           type: string
 *         description: Filter by specific task id
 *     responses:
 *       200:
 *         description: An array of tasks
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Retrieve details of a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A task object with details
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Full task fields for creation
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Task
 *               status:
 *                 type: string
 *                 example: "Pending"
 *     responses:
 *       201:
 *         description: Task created successfully
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Task update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Task
 *               status:
 *                 type: string
 *                 example: "Completed"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       500:
 *         description: Server error
 */

// Route definitions
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", authenticate, authorize(["admin", "supervisor"]), createTask); // Admin/Supervisor only
router.put("/:id", updateTask);
router.delete("/:id", authenticate, authorize(["admin", "supervisor"]), deleteTask); // Admin/Supervisor only

module.exports = router;
