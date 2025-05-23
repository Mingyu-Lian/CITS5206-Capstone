const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/middleware");
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
} = require("../controllers/projectController");


// Route definitions
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", authenticate, authorize(["admin", "supervisor"]), createProject);
router.patch("/:id", authenticate, authorize(["admin", "supervisor"]), updateProject);

module.exports = router;

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
 *     summary: List all active projects. Access - All users
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of active projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 6637db238ae2a21e3e4fa123
 *                   name:
 *                     type: string
 *                     example: Project Alpha
 *                   description:
 *                     type: string
 *                     example: Short description of the project
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2025-01-01"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2025-12-31"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-01T10:00:00.000Z"
 *                   updateHistory:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                           example: 6637db238ae2a21e3e4fa111
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-02-01T10:00:00.000Z"
 *                   isActive:
 *                     type: boolean
 *                     example: true
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project. Access - Admin and Supervisor
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Project
 *               description:
 *                 type: string
 *                 example: Detailed project description.
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project created successfully
 *                 project:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     createdBy:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     isActive:
 *                       type: boolean
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get details of a specific project. Access - All users
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *                 createdBy:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updateHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 isActive:
 *                   type: boolean
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   patch:
 *     summary: Update/logic delete project details. Access - Admin and Supervisor
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Project Name
 *               description:
 *                 type: string
 *                 example: Updated description
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project updated successfully
 *                 project:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     createdBy:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     isActive:
 *                       type: boolean
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
