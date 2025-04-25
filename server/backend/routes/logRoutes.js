const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/middleware");
const { getAllLogs, createLog, updateLog, deleteLog } = require("../controllers/logController");

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Operations related to logs
 */

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: List logs with optional filtering by user and pagination
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: userid
 *         schema:
 *           type: string
 *         description: Filter logs by user id
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of logs per page
 *     responses:
 *       200:
 *         description: Logs list with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/logs:
 *   post:
 *     summary: Create a new log entry
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Full log fields required for creation
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 643d1f2e5f1b2c0012345678
 *               action:
 *                 type: string
 *                 example: "Created asset"
 *               locoID:
 *                 type: string
 *                 example: 643d1f2e5f1b2c0012345678
 *               details:
 *                 type: string
 *                 example: "Detailed log message"
 *               actionTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-12T10:00:00Z"
 *     responses:
 *       201:
 *         description: Log created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/logs/{id}:
 *   put:
 *     summary: Update a log entry
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Log id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Log update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 example: "Updated log action"
 *     responses:
 *       200:
 *         description: Log record updated successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/logs/{id}:
 *   delete:
 *     summary: Delete a log entry
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Log id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Log record deleted successfully
 *       500:
 *         description: Server error
 */

// Route definitions
router.get("/", getAllLogs);
router.post("/", createLog);
router.put("/:id", updateLog);
router.delete("/:id", deleteLog);

module.exports = router;
