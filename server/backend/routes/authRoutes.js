const express = require("express");
const router = express.Router();
const { register, login, getMe, logout,getAllUsers,updateUser, updateProfile } = require("../controllers/authController");
const { authenticate, authorize } = require("../middleware/middleware");
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and registration
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - personName
 *               - email
 *               - password
 *               - role
 *               - discipline
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: 123456
 *               selectedDiscipline:
 *                 type: string
 *                 example: Mechanical
 *                 description: Optional discipline to select during login
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: jwt-token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 644f1a2b3c4d5e6f7g8h9i0j
 *                     username:
 *                       type: string
 *                       example: admin
 *                     role:
 *                       type: string
 *                       example: Admin
 *                     selectedDiscipline:
 *                       type: string
 *                       example: Mechanical
 *                       nullable: true
 *       400:
 *         description: Invalid credentials or user not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - personName
 *               - email
 *               - password
 *               - role
 *               - discipline
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               personName:
 *                 type: string
 *                 example: Admin User
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 example: admin
 *               discipline:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Mechanical"]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Registration error or invalid input
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user. Access - All users 
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 643d1f2e5f1b2c0012345678
 *                 username:
 *                   type: string
 *                   example: admin
 *                 email:
 *                   type: string
 *                   example: admin@example.com
 *                 role:
 *                   type: string
 *                   example: admin
 *               discipline:
 *             type: array
 *           items:
 *           type: string
 *         example: Mechanical
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the current user. Access - All users 
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users. Access - Admin and Supervisor
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 643d1f2e5f1b2c0012345678
 *                       username:
 *                         type: string
 *                         example: admin
 *                       email:
 *                         type: string
 *                         example: admin@example.com
 *                       role:
 *                         type: string
 *                         example: admin
 *                       discipline:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Mechanical"]
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/auth/users/{id}:
 *   patch:
 *     summary: Update a user from admin side (all info). Access - Admin
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               role:
 *                 type: string
 *                 example: admin
 *               discipline:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Mechanical"]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/auth/profile:
 *   patch:
 *     summary: Update the authenticated user's password. Access - User itself
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Invalid input (e.g., missing password)
 *       500:
 *         description: Server error
 */
// Define the routes with their corresponding controller functions
router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);
router.post("/logout",logout);
router.get("/users",authenticate, authorize(["admin","supervisor"]),getAllUsers);
router.patch("/users/:id",authenticate, authorize(["admin"]),updateUser);
router.patch("/profile", authenticate, updateProfile);
module.exports = router;
