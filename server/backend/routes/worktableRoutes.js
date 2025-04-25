const express = require("express");
const { authenticate, authorize } = require("../middleware/middleware");
const { createWorkTable, getWorkTableById, updateWorkTable, deleteWorkTable,getAllWorkTables } = require("../controllers/worktableController");

const router = express.Router();
/**
 * @swagger
 * /api/worktables:
 *   get:
 *     summary: Get all WorkTables
 *     tags: [WorkTables]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all WorkTables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "643d1f2e5f1b2c0012345678"
 *                   tableId:
 *                     type: string
 *                     example: "WT12345"
 *                   title:
 *                     type: string
 *                     example: "Test Equipment Records"
 *                   referenceName:
 *                     type: string
 *                     example: "Table 1"
 *                   assignedSupervisor:
 *                     type: string
 *                     example: "643d1f2e5f1b2c0012345678"
 *                   assignedEngineer:
 *                     type: string
 *                     example: "643d1f2e5f1b2c0012345679"
 *                   disciplineRequire:
 *                     type: string
 *                     example: "643d1f2e5f1b2c001234567A"
 *                   parentsWMS:
 *                     type: string
 *                     example: "643d1f2e5f1b2c001234567B"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-23T12:00:00.000Z"
 *                   isActive:
 *                     type: boolean
 *                     example: true
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/worktables:
 *   post:
 *     summary: Create a new WorkTable
 *     tags: [WorkTables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tableId:
 *                 type: string
 *                 example: "WT12345"
 *               title:
 *                 type: string
 *                 example: "Test Equipment Records"
 *               referenceName:
 *                 type: string
 *                 example: "Table 1"
 *               assignedSupervisor:
 *                 type: string
 *                 example: "643d1f2e5f1b2c0012345678"
 *               assignedEngineer:
 *                 type: string
 *                 example: "643d1f2e5f1b2c0012345679"
 *               disciplineRequire:
 *                 type: string
 *                 example: "643d1f2e5f1b2c001234567A"
 *               parentsWMS:
 *                 type: string
 *                 example: "643d1f2e5f1b2c001234567B"
 *               columns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     headerText:
 *                       type: string
 *                       example: "Item"
 *               rows:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     headerRowText:
 *                       type: string
 *                       example: "Instructional Header"
 *     responses:
 *       201:
 *         description: WorkTable created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/worktables/{id}:
 *   get:
 *     summary: Get a WorkTable by ID
 *     tags: [WorkTables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the WorkTable
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: WorkTable retrieved successfully
 *       404:
 *         description: WorkTable not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/worktables/{id}:
 *   put:
 *     summary: Update a WorkTable
 *     tags: [WorkTables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the WorkTable to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Title"
 *               referenceName:
 *                 type: string
 *                 example: "Updated Table 1"
 *     responses:
 *       200:
 *         description: WorkTable updated successfully
 *       404:
 *         description: WorkTable not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/worktables/{id}:
 *   delete:
 *     summary: Delete a WorkTable
 *     tags: [WorkTables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the WorkTable to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: WorkTable deleted successfully
 *       404:
 *         description: WorkTable not found
 *       500:
 *         description: Server error
 */

// Route definitions
router.get("/",  authenticate, authorize(["admin", "supervisor"]),getAllWorkTables);
router.post("/", authenticate, authorize(["admin", "supervisor"]), createWorkTable);
router.get("/:id", authenticate, authorize(["admin", "supervisor", "engineer"]), getWorkTableById);
router.put("/:id", authenticate, authorize(["admin", "supervisor"]), updateWorkTable);
router.delete("/:id", authenticate, authorize(["admin", "supervisor"]), deleteWorkTable);

module.exports = router;