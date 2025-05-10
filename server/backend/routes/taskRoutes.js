// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  patchTask
} = require("../controllers/taskController");
const { authenticate } = require("../middleware/middleware");

router.get("/", authenticate, getAllTasks);
router.get("/:id", authenticate, getTaskById);
router.post("/", authenticate, createTask);
router.patch("/:id", authenticate, patchTask);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task operations for installation WMS
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all active tasks. Access - assigned users (engineer and supervisor) and all admin
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: WMSid
 *         schema:
 *           type: string
 *         description: Project ID (meta.projectId) to filter
 *       - in: query
 *         name: taskID
 *         schema:
 *           type: string
 *         description: Specific Task ID to filter
 *     responses:
 *       200:
 *         description: A list of tasks
 *       403:
 *         description: Forbidden (if user is not assigned)
 *       500:
 *         description: Server error
 */
router.get("/", authenticate, getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID. Access - assigned users (engineer and supervisor) and all admin
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task detail
 *       403:
 *         description: Forbidden if user not assigned
 *       404:
 *         description: Task not found or inactive
 *       500:
 *         description: Server error
 */
router.get("/:id", authenticate, getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create new task. Access - admin only
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Task data to be created
 *     responses:
 *       201:
 *         description: Task created
 *       403:
 *         description: Forbidden (only admin allowed)
 *       500:
 *         description: Server error
 */
router.post("/", authenticate, createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update/logic delete task partially. Access - assigned users (engineer and supervisor) and all admin
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID to patch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *     responses:
 *       200:
 *         description: Task updated
 *       403:
 *         description: Forbidden (not assigned or not admin)
 *       404:
 *         description: Task not found or inactive
 *       500:
 *         description: Patch failed
 */