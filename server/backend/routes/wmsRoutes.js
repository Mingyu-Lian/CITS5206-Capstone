const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/middleware");
const {
  getAllWMS,
  getWMSById,
  createWMS,
  updateWMS,
  deleteWMS,
} = require("../controllers/wmsController");

/**
 * @swagger
 * tags:
 *   name: WMS
 *   description: Operations related to WMS files
 */

/**
 * @swagger
 * /api/wms:
 *   get:
 *     summary: List WMS files, with optional filters (isActive, locoId)
 *     tags: [WMS]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: locoId
 *         schema:
 *           type: string
 *         description: Filter by loco type id
 *     responses:
 *       200:
 *         description: An array of WMS files
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/wms/{id}:
 *   get:
 *     summary: Retrieve a specific WMS file by id
 *     tags: [WMS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: WMS file id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A WMS object with full details
 *       404:
 *         description: WMS not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/wms/{id}:
 *   put:
 *     summary: Update a WMS file
 *     tags: [WMS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: WMS id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Full WMS update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated WMS Name
 *     responses:
 *       200:
 *         description: WMS updated successfully
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/wms:
 *   post:
 *     summary: Create a new WMS file
 *     tags: [WMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Full WMS fields (document_id, name, projectId, version, etc.)
 *             properties:
 *               document_id:
 *                 type: string
 *                 example: DOC12345
 *               name:
 *                 type: string
 *                 example: WMS File Name
 *               projectId:
 *                 type: string
 *                 example: PROJ123
 *               version:
 *                 type: string
 *                 example: "1.0"
 *               description:
 *                 type: string
 *                 example: Description of the WMS file
 *     responses:
 *       201:
 *         description: WMS created successfully
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/wms/{id}:
 *   delete:
 *     summary: Delete a WMS file
 *     tags: [WMS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: WMS id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: WMS file deleted successfully
 *       500:
 *         description: Server error
 */

// Route definitions
router.get("/", getAllWMS);
router.get("/:id", getWMSById);
router.post("/", authenticate, authorize(["admin", "supervisor"]),createWMS);
router.put("/:id", updateWMS);
router.delete("/:id", deleteWMS);

module.exports = router;
