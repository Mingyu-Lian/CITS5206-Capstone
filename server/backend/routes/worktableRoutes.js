const express = require("express");
const router = express.Router();

const {
  createWorkTable,
  getWorkTables,
  listWorkTables,
  updateWorkTable
} = require("../controllers/workTableController");

const { authenticate } = require("../middleware/middleware");

// 所有接口都需认证
router.post("/", authenticate, createWorkTable);
router.get("/", authenticate, getWorkTables);
router.get("/list", authenticate, listWorkTables);
router.patch("/:id", authenticate, updateWorkTable);

module.exports = router;
