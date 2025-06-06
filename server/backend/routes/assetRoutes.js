const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/middleware");
const {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
} = require("../controllers/assetController");

/**
 * @swagger
 * tags:
 *   name: Assets
 *   description: Operations related to assets 
 */

/**
 * @swagger
 * /api/assets:
 *   get:
 *     summary: List all assets. Access - All users
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: A list of assets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/assets/{id}:
 *   get:
 *     summary: Retrieve asset details. Access - All users
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Asset id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An asset object with full details
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/assets:
 *   post:
 *     summary: Create a new asset. Access - Admin and Supervisor
 *     tags: [Assets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - assetType
 *               - status
 *             properties:
 *               code:
 *                 type: string
 *                 example: A1001
 *               name:
 *                 type: string
 *                 example: Asset Name
 *               assetType:
 *                 type: string
 *                 example: TypeA
 *               description:
 *                 type: string
 *                 example: Asset description
 *               locoID:
 *                 type: number
 *                 example: 123
 *               locoType:
 *                 type: string
 *                 example: 643d1f2e5f1b2c0012345678
 *               status:
 *                 type: string
 *                 example: Active
 *               parentAsset:
 *                 type: string
 *                 example: 643d1f2e5f1b2c0012345678
 *     responses:
 *       201:
 *         description: Asset created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Asset created successfully
 *                 asset:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: A1001
 *                     name:
 *                       type: string
 *                       example: Asset Name
 *                     assetType:
 *                       type: string
 *                       example: TypeA
 *                     description:
 *                       type: string
 *                       example: Asset description
 *                     locoID:
 *                       type: number
 *                       example: 123
 *                     locoType:
 *                       type: string
 *                       example: 643d1f2e5f1b2c0012345678
 *                     status:
 *                       type: string
 *                       example: Active
 *                     parentAsset:
 *                       type: string
 *                       example: 643d1f2e5f1b2c0012345678
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/assets/{id}:
 *   put:
 *     summary: Update/logical delete an asset. Access - Admin and Supervisor
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Asset id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Asset update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: A1001-updated
 *               name:
 *                 type: string
 *                 example: Updated Asset Name
 *               description:
 *                 type: string
 *                 example: Updated description
 *               assetType:
 *                 type: string
 *                 example: TypeB
 *               status:
 *                 type: string
 *                 example: Inactive
 *     responses:
 *       200:
 *         description: Asset updated successfully
 *       500:
 *         description: Server error
 */

// Route definitions
router.get("/", getAllAssets);
router.get("/:id", getAssetById);
router.post("/", authenticate, authorize(["admin", "supervisor"]), createAsset);
router.put("/:id", authenticate, authorize(["admin", "supervisor"]),updateAsset);

module.exports = router;
