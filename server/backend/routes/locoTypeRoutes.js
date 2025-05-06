const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/middleware");
const {
  getAllLocoTypes,
  getLocoTypeById,
  createLocoType,
  updateLocoType,
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
 *     summary: List all active locomotive types (short info). Access - All users
 *     tags: [LocoTypes]
 *     responses:
 *       200:
 *         description: A list of active locomotive types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 locoTypes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 643d1f2e5f1b2c0012345678
 *                       name:
 *                         type: string
 *                         example: Electric
 *                       description:
 *                         type: string
 *                         example: Electric locomotive type description
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/loco-types:
 *   post:
 *     summary: Create a new locomotive type. Access - Admin and Supervisor
 *     tags: [LocoTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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

/**
 * @swagger
 * /api/loco-types/{id}:
 *   get:
 *     summary: Get a specific locomotive type by ID (even inactive). Access - All users
 *     tags: [LocoTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The loco type ID
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
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Locomotive type not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/loco-types/{id}:
 *   put:
 *     summary: Update/logic delete a locomotive type. Access - Admin and Supervisor
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
 *                 example: Updated description for Diesel
 *               isActive:
 *                 type: boolean
 *                 example: false
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
 *                   example: Loco type updated successfully
 *       404:
 *         description: Locomotive type not found
 *       500:
 *         description: Server error
 */


// Route definitions
router.get("/", getAllLocoTypes);
router.get("/:id", getLocoTypeById);
router.post("/", authenticate, authorize(["admin", "supervisor"]), createLocoType);
router.put("/:id", authenticate, authorize(["admin", "supervisor"]), updateLocoType);

module.exports = router;