const express = require("express");
const router = express.Router();
const { getAllLocoTypes,
  getLocoTypeById,
  createLocoType,
  updateLocoType,
  deleteLocoType,
} = require("../controllers/locoTypeController");

/**
 * @swagger
 * tags:
 *   name: LocoTypes
 *   description: Operations related to locomotive types
 */

/**
 * @swagger
 * /api/loco-types:
 *   get:
 *     summary: List all locomotive types
 *     tags: [LocoTypes]
 *     responses:
 *       200:
 *         description: A list of locomotive types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 643d1f2e5f1b2c0012345678
 *                   name:
 *                     type: string
 *                     example: Electric
 *                   description:
 *                     type: string
 *                     example: Electric locomotive type description
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/loco-types/{id}:
 *   put:
 *     summary: Update an existing locomotive type
 *     tags: [LocoTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the locomotive type to update
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
 *                 example: Updated Diesel
 *               description:
 *                 type: string
 *                 example: Updated description for Diesel locomotive type
 *     responses:
 *       200:
 *         description: Locomotive type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Locomotive type updated successfully
 *                 _id:
 *                   type: string
 *                   example: 643d1f2e5f1b2c0012345678
 *                 name:
 *                   type: string
 *                   example: Updated Diesel
 *                 description:
 *                   type: string
 *                   example: Updated description for Diesel locomotive type
 *       404:
 *         description: Locomotive type not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/loco-types/{id}:
 *   get:
 *     summary: Get a specific locomotive type by id
 *     tags: [LocoTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The loco type id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Locomotive type data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 643d1f2e5f1b2c0012345678
 *                 name:
 *                   type: string
 *                   example: Electric
 *                 description:
 *                   type: string
 *                   example: Electric locomotive type description
 *       404:
 *         description: Locomotive type not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/loco-types:
 *   post:
 *     summary: Create a new locomotive type
 *     tags: [LocoTypes]
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
 *                 example: Diesel
 *               description:
 *                 type: string
 *                 example: Diesel locomotive type description
 *     responses:
 *       201:
 *         description: Loco type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Loco type created successfully
 *                 _id:
 *                   type: string
 *                   example: 643d1f2e5f1b2c0012345678
 *                 name:
 *                   type: string
 *                   example: Diesel
 *                 description:
 *                   type: string
 *                   example: Diesel locomotive type description
 *       500:
 *         description: Server error
 */

// Route definitions
router.get("/", getAllLocoTypes);
router.get("/:id", getLocoTypeById);
router.post("/", authenticate, authorize(["admin", "supervisor"]), createLocoType);
router.put("/:id", authenticate, authorize(["admin", "supervisor"]), updateLocoType);
router.delete("/:id", deleteLocoType);

module.exports = router;
