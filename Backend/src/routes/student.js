const express = require('express')
const { createStudent, getStudents, getStudent, deleteStudent, updateStudent } = require('../controllers/student')



const studentRouter = express.Router()


studentRouter.get("/",getStudents)
studentRouter.get("/:studentId",getStudent)
studentRouter.post("/",createStudent)
studentRouter.delete("/:studentId", deleteStudent)
studentRouter.patch("/:studentId", updateStudent)

module.exports = studentRouter