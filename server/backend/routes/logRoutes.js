const express = require("express");
const router = express.Router();
const { getAllLogs, createLog, updateLog, deleteLog } = require("../controllers/logController");
const { authenticate, authorize } = require("../middleware/middleware");

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
 *     summary: List logs with optional filtering by user, loco, and pagination (Access: All roles/users)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userid
 *         schema:
 *           type: string
 *         description: (Admin only) Filter logs by specific user id
 *       - in: query
 *         name: locoID
 *         schema:
 *           type: string
 *         description: Filter logs by locomotive id
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of logs per page (default is 20)
 *     description: 
 *       Admin users can view all logs and filter by userId and locoID. 
 *       Regular users can only view their own logs, optionally filtered by locoID.
 *     responses:
 *       200:
 *         description: Logs list with pagination info
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/logs:
 *   post:
 *     summary: Create a new log entry (Access: All roles/users)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               action:
 *                 type: string
 *               locoID:
 *                 type: string
 *               details:
 *                 type: string
 *               actionTime:
 *                 type: string
 *                 format: date-time
 *               ip:
 *                 type: string
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
 *     summary: Update a log entry (Access: Admin only)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Log ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *               details:
 *                 type: string
 *     responses:
 *       200:
 *         description: Log updated successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/logs/{id}:
 *   delete:
 *     summary: Delete a log entry （Access: Admin only)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Log ID
 *     responses:
 *       200:
 *         description: Log deleted successfully
 *       500:
 *         description: Server error
 */

// 路由定义
router.get("/", authenticate, getAllLogs);
router.post("/", authenticate, createLog);
router.put("/:id", authenticate, authorize(["admin"]), updateLog);
router.delete("/:id", authenticate, authorize(["admin"]), deleteLog);

module.exports = router;

