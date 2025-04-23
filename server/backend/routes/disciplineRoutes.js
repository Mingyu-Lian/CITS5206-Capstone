const express = require("express");
const router = express.Router();
const {
  getAllDisciplines,
  getDisciplineById,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
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
 *     summary: List all disciplines
 *     tags: [Disciplines]
 *     responses:
 *       200:
 *         description: An array of disciplines
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/disciplines/{id}:
 *   get:
 *     summary: Retrieve a specific discipline by id
 *     tags: [Disciplines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Discipline id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A discipline object
 *       404:
 *         description: Discipline not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/disciplines:
 *   post:
 *     summary: Create a new discipline
 *     tags: [Disciplines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mechanical
 *               description:
 *                 type: string
 *                 example: Mechanical discipline description
 *     responses:
 *       201:
 *         description: Discipline created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/disciplines/{id}:
 *   put:
 *     summary: Update a discipline
 *     tags: [Disciplines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Discipline id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Discipline update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Mechanical
 *               description:
 *                 type: string
 *                 example: Updated discipline description
 *     responses:
 *       200:
 *         description: Discipline updated successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/disciplines/{id}:
 *   delete:
 *     summary: Delete a discipline
 *     tags: [Disciplines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Discipline id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discipline deleted successfully
 *       500:
 *         description: Server error
 */

// Route definitions
router.get("/", getAllDisciplines);
router.get("/:id", getDisciplineById);
router.post("/",authenticate, authorize(["admin", "supervisor"]), createDiscipline);
router.put("/:id",authenticate, authorize(["admin", "supervisor"]), updateDiscipline);
router.delete("/:id", deleteDiscipline);

module.exports = router;
