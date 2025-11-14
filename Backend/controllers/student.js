const mongoose = require("mongoose");
const Student = require("../models/student");

//get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}).sort({ id: 1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get a student
const getStudent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id) ) {
    res.status(404).json({ error: "No such student exists" });
  }

  try {
    const student = await Student.findById(id);
    
    if(!student){
        res.status(404).json({error : "No such students exits"})
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//create a new student
const createStudent = async (req, res) => {
  const {
    studentId,
    name,
    classLevel,
    balance,
    role,
    hasEatenToday,
    lastEatenDate,
  } = req.body;

  try {
    const student = await Student.create({
      studentId,
      name,
      classLevel,
      balance,
      role,
      hasEatenToday,
      lastEatenDate,
    });

    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a student
const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findOneAndDelete({ _id: id }, { new: true });
    
    if(!student){
        res.status(404).json({error : "No such students exits"})
    }

    res.status(200).json(student);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//update a student info
const updateStudent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: "No such student exits" });
  }

  try {
    const student = await Student.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      { new: true }
    );
    
    if(!student){
        res.status(404).json({error : "No such students exits"})
    }

    res.status(200).json(student);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  deleteStudent,
  updateStudent,
};
