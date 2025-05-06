const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/middleware");
const {
  getAllDisciplines,
  getDisciplineById,
  createDiscipline,
  updateDiscipline,
} = require("../controllers/disciplineController");

/**
 * @swagger
 * tags:
 *   name: Disciplines
 *   description: Operations related to disciplines
 */

/**
 * @swagger
 * /api/disciplines:
 *   get:
 *     summary: List all active disciplines (short info). Access - All users
 *     tags: [Disciplines]
 *     responses:
 *       200:
 *         description: List of active disciplines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   client:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/disciplines:
 *   post:
 *     summary: Create a new discipline. Access - Admin only
 *     tags: [Disciplines]
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
 *               - client
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               client:
 *                 type: string
 *     responses:
 *       201:
 *         description: Discipline created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/disciplines/{id}:
 *   get:
 *     summary: Get a specific discipline (all info). Access - All users
 *     tags: [Disciplines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discipline object
 *       404:
 *         description: Discipline not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/disciplines/{id}:
 *   patch:
 *     summary: Update/logic delete a discipline. Access - Admin only
 *     tags: [Disciplines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               client:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Discipline updated successfully
 *       404:
 *         description: Discipline not found
 *       500:
 *         description: Server error
 */

// Routes
router.get("/", getAllDisciplines);
router.post("/", authenticate, authorize(["admin"]), createDiscipline);
router.get("/:id", getDisciplineById);
router.patch("/:id", authenticate, authorize(["admin"]), updateDiscipline);

module.exports = router;
