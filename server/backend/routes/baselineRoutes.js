const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/middleware");
const {
  getAllBaselines,
  createBaseline,
  getBaselineById,
  updateBaseline,
  addVersion,
  updateVersion,
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
 *   get:
 *     summary: Get all baselines
 *     tags: [Baselines]
 *     responses:
 *       200:
 *         description: Successfully retrieved all baselines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 baselines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d9f1181faebf1e1234567d"
 *                       softwareName:
 *                         type: string
 *                         example: "ControlSoft"
 *                       description:
 *                         type: string
 *                         example: "Initial release of ControlSoft"
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       versions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             versionId:
 *                               type: string
 *                               example: "v1"
 *                             version:
 *                               type: string
 *                               example: "1.0"
 *                             createdBy:
 *                               type: string
 *                               example: "644f1a2b3c4d5e6f7g8h9i0j"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2025-04-01T00:00:00.000Z"
 *                             note:
 *                               type: string
 *                               example: "Initial release"
 *                             isActive:
 *                               type: boolean
 *                               example: true
 *                 total:
 *                   type: integer
 *                   example: 5
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
 * /api/baselines/{baselineId}:
 *   patch:
 *     summary: Update a baseline
 *     tags: [Baselines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: baselineId
 *         required: true
 *         schema:
 *           type: string
 *         description: Baseline ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               softwareName:
 *                 type: string
 *                 example: Updated Software Name
 *               description:
 *                 type: string
 *                 example: Updated description
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Baseline updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Baseline updated
 *                 baseline:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d9f1181faebf1e1234567d
 *                     softwareName:
 *                       type: string
 *                       example: Updated Software Name
 *                     description:
 *                       type: string
 *                       example: Updated description
 *                     isActive:
 *                       type: boolean
 *                       example: true
 */
/**
 * @swagger
 * /api/baselines/{baselineId}/versions:
 *   post:
 *     summary: Add a new version to a baseline
 *     tags: [Baselines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: baselineId
 *         required: true
 *         schema:
 *           type: string
 *         description: Baseline ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               version:
 *                 type: string
 *                 example: 1.01
 *               note:
 *                 type: string
 *                 example: Initial release
 *     responses:
 *       201:
 *         description: Version added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Version added
 *                 version:
 *                   type: object
 *                   properties:
 *                     versionId:
 *                       type: string
 *                       example: v1
 *                     version:
 *                       type: string
 *                       example: 1.01
 *                     note:
 *                       type: string
 *                       example: Initial release
 *                     createdBy:
 *                       type: string
 *                       example: 644f1a2b3c4d5e6f7g8h9i0j
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-01T00:00:00.000Z
 *                     isActive:
 *                       type: boolean
 *                       example: true
 */
/**
 * @swagger
 * /api/baselines/{baselineId}/versions/{versionId}:
 *   patch:
 *     summary: Update a version of a baseline
 *     tags: [Baselines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: baselineId
 *         required: true
 *         schema:
 *           type: string
 *         description: Baseline ID
 *       - in: path
 *         name: versionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Version ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               version:
 *                 type: string
 *                 example: 1.02
 *               note:
 *                 type: string
 *                 example: Updated release notes
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               usageAdd:
 *                 type: object
 *                 properties:
 *                   locoId:
 *                     type: string
 *                     example: 60d9f1171faebf1e1234567b
 *     responses:
 *       200:
 *         description: Version updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Version updated
 *                 version:
 *                   type: object
 *                   properties:
 *                     versionId:
 *                       type: string
 *                       example: v1
 *                     version:
 *                       type: string
 *                       example: 1.02
 *                     note:
 *                       type: string
 *                       example: Updated release notes
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-02T00:00:00.000Z
 *                     usedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-02T12:00:00.000Z
 *                     usedBy:
 *                       type: string
 *                       example: 644f1a2b3c4d5e6f7g8h9i0j
 *                     locoId:
 *                       type: string
 *                       example: 60d9f1171faebf1e1234567b
 */
// Route definitions
router.get("/", getAllBaselines);
router.post("/", authenticate, authorize(["admin", "supervisor"]),createBaseline);
router.get("/:id", getBaselineById);
router.patch("/:id", authenticate, authorize(["admin", "supervisor"]),updateBaseline);
router.post("/:baselineId/versions", authenticate, authorize(["admin", "supervisor"]),addVersion);
router.patch("/:baselineId/versions/:versionId", authenticate, authorize(["admin", "supervisor"]),updateVersion);
module.exports = router;
