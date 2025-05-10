const express = require("express");
const router = express.Router();

const {
  createWorkTable,
  getWorkTables,
  listWorkTables,
  updateWorkTable
} = require("../controllers/workTableController");

const { authenticate } = require("../middleware/middleware");

// all route requires authentication
router.post("/", authenticate, createWorkTable);
router.get("/", authenticate, getWorkTables);
router.get("/list", authenticate, listWorkTables);
router.patch("/:id", authenticate, updateWorkTable);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: WorkTables
 *   description: WorkTable Management API - When commissioning 
 */

/**
 * @swagger
 * /api/worktables:
 *   post:
 *     summary: Create a new WorkTable. Access - only admin or supervisor
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
 *               meta:
 *                 type: object
 *                 description: Meta data (projectId, version, etc.)
 *                 example:
 *                   projectId: "Project-XYZ"
 *                   Version: "v1.0"
 *               Content:
 *                 $ref: '#/components/schemas/WorkTableContent'
 *     responses:
 *       201:
 *         description: WorkTable created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkTable'
 *       400:
 *         description: Invalid input or unauthorized assignment
 *       403:
 *         description: Only admin or supervisor can create WorkTable
 */
/**
 * @swagger
 * /api/worktables:
 *   get:
 *     summary: Get all accessible WorkTables (full content). Access - Admin, Supervisor, Engineer (only assigned)
 *     tags: [WorkTables]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of WorkTables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkTable'
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/worktables/list:
 *   get:
 *     summary: Get summarized list of WorkTables (projectId, assignees, doc title, etc.). - Admin, Supervisor, Engineer (only assigned)
 *     tags: [WorkTables]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summarized list of WorkTables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   meta:
 *                     type: object
 *                     properties:
 *                       projectId:
 *                         type: string
 *                       assignedSupervisor:
 *                         type: array
 *                         items:
 *                           type: string
 *                       assignedEngineer:
 *                         type: array
 *                         items:
 *                           type: string
 *                       Version:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                   Content:
 *                     type: object
 *                     properties:
 *                       documentTitle:
 *                         type: string
 *                       documentNumber:
 *                         type: string
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/worktables/{id}:
 *   patch:
 *     summary: Update a WorkTable (including assigning users or logic delete). - Admin, Supervisor, Engineer (only assigned)
 *     tags: [WorkTables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: WorkTable ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               meta:
 *                 assignedEngineer: ["663c5a14b1fcdf001fef1ccc"]
 *                 isActive: true
 *               Content:
 *                 documentTitle: "Updated Title"
 *     responses:
 *       200:
 *         description: WorkTable updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkTable'
 *       400:
 *         description: Bad request or validation error
 *       403:
 *         description: User does not have permission
 *       404:
 *         description: WorkTable not found
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
