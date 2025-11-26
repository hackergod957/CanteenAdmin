const express = require("express");
const {
  createStudent,
  getStudents,
  getStudent,
  deleteStudent,
  updateStudent,
} = require("../controllers/student");
const { authenticateToken } = require("../controllers/auth");

const studentRouter = express.Router();

studentRouter.get("/", getStudents);
studentRouter.get("/:studentId", getStudent);
studentRouter.post("/", authenticateToken, createStudent);
studentRouter.delete("/:studentId", authenticateToken, deleteStudent);
studentRouter.patch("/:studentId", authenticateToken, updateStudent);

module.exports = studentRouter;
