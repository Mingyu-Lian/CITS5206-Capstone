const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/middleware");
const {
  getAllBaselines,
  createBaseline,
  getBaselineById,
  updateBaseline,
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
 *     summary: List all baselines with pagination (Access: All roles/users)
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
 *     summary: Create a new baseline (Access: Admin/Supervisor)
 *     tags: [Baselines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - softwareId
 *               - softwareName
 *             properties:
 *               softwareId:
 *                 type: string
 *                 example: "644f1a2b3c4d5e6f7g8h9i0j"
 *               softwareName:
 *                 type: string
 *                 example: "My Software"
 *               description:
 *                 type: string
 *                 example: "Initial baseline"
 *               versions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     versionId:
 *                       type: string
 *                       example: "v1"
 *                     version:
 *                       type: string
 *                       example: "1.01"
 *                     createdBy:
 *                       type: string
 *                       example: "644f1a2b3c4d5e6f7g8h9i1k"
 *                     note:
 *                       type: string
 *                       example: "Initial release"
 *     responses:
 *       201:
 *         description: Baseline created successfully
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/baselines/{id}:
 *   get:
 *     summary: Retrieve a specific baseline by id (Access: All roles/users)
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
 *     summary: Update a baseline (Access: Admin/Supervisor)
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
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       200:
 *         description: Baseline updated successfully
 *       500:
 *         description: Server error
 */

// Route definitions
router.get("/", getAllBaselines);
router.post("/", authenticate, authorize(["admin", "supervisor"]),createBaseline);
router.get("/:id", getBaselineById);
router.put("/:id", authenticate, authorize(["admin", "supervisor"]),updateBaseline);

module.exports = router;
