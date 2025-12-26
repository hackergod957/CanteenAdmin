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
  studentRouter.get("/:id", getStudent);
  studentRouter.post("/", authenticateToken, createStudent);
  studentRouter.delete("/:id", authenticateToken, deleteStudent);
  studentRouter.patch("/:id", authenticateToken, updateStudent);

  module.exports = studentRouter;
