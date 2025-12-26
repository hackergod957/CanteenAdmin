const express = require("express");

const { authenticateToken } = require("../controllers/auth");
const {
  getStaffs,
  getStaff,
  createStaff,
  deleteStaff,
  updateStaff,
} = require("../controllers/staff");

const staffRouter = express.Router();

staffRouter.get("/", getStaffs);
staffRouter.get("/:id", getStaff);
staffRouter.post("/", authenticateToken, createStaff);
staffRouter.delete("/:id", authenticateToken, deleteStaff);
staffRouter.patch("/:id", authenticateToken, updateStaff);

module.exports = staffRouter;
