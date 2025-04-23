const express = require("express");
const router = express.Router();
const {
  getAllBaselines,
  createBaseline,
  getBaselineById,
  updateBaseline,
  deleteBaseline,
} = require("../controllers/baselineController");

/**
 * @swagger
 * tags:
 *   name: Baselines
 *   description: Operations related to software baselines
 */

/**
 * @swagger
 * /api/baselines:
 *   get:
 *     summary: List all baselines with pagination
 *     tags: [Baselines]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Current page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Returns baselines, totalPages, and currentPage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 baselines:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/baselines:
 *   post:
 *     summary: Create a new baseline
 *     tags: [Baselines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - softwareName
 *               - softwareVersion
 *             properties:
 *               softwareName:
 *                 type: string
 *                 example: "My Software"
 *               softwareVersion:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["1.0", "1.1"]
 *               description:
 *                 type: string
 *                 example: "Initial baseline"
 *     responses:
 *       201:
 *         description: Baseline created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Baseline created successfully
 *                 _id:
 *                   type: string
 *                 softwareName:
 *                   type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/baselines/{id}:
 *   get:
 *     summary: Retrieve a specific baseline by id
 *     tags: [Baselines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Baseline id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A baseline object
 *       404:
 *         description: Baseline not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/baselines/{id}:
 *   put:
 *     summary: Update a baseline
 *     tags: [Baselines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Baseline id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Baseline update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               softwareName:
 *                 type: string
 *                 example: "Updated Software"
 *               softwareVersion:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["1.0", "1.2"]
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       200:
 *         description: Baseline updated successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/baselines/{id}:
 *   delete:
 *     summary: Delete a baseline
 *     tags: [Baselines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Baseline id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Baseline deleted successfully
 *       500:
 *         description: Server error
 */

// Route definitions
router.get("/", getAllBaselines);
router.post("/", authenticate, authorize(["admin", "supervisor"]),createBaseline);
router.get("/:id", getBaselineById);
router.put("/:id", authenticate, authorize(["admin", "supervisor"]),updateBaseline);
router.delete("/:id", deleteBaseline);

module.exports = router;
