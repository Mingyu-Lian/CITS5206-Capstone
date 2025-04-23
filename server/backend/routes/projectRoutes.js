const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Operations related to projects
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: List all projects (short list)
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: An array of projects with limited fields (name, startDate, endDate, createdAt, updatedAt)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Retrieve detailed information for a specific project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A project object with full details
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Full project fields required for creation
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Project
 *               description:
 *                 type: string
 *                 example: Project description
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               createdBy:
 *                 type: string
 *                 example: 643d1f2e5f1b2c0012345678
 *     responses:
 *       201:
 *         description: Project created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Full project update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Project
 *               description:
 *                 type: string
 *                 example: Updated project description
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       500:
 *         description: Server error
 */

// Route definitions
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/",authenticate, authorize(["admin", "supervisor"]), createProject);
router.put("/:id",authenticate, authorize(["admin", "supervisor"]), updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
