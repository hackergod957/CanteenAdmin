const express = require('express')
const { createStudent, getStudents, getStudent, deleteStudent, updateStudent } = require('../controllers/student')



const studentRouter = express.Router()


studentRouter.get("/",getStudents)
studentRouter.get("/:id",getStudent)
studentRouter.post("/",createStudent)
studentRouter.delete("/:id", deleteStudent)
studentRouter.patch("/:id", updateStudent)

module.exports = studentRouter