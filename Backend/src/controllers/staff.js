const mongoose = require("mongoose");
const Staff = require("../models/staff");

// get all staff
const getStaffs = async (req, res) => {
  try {
    const staffs = await Staff.find({}).sort({ id: 1 });
    res.status(200).json(staffs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get a staff
const getStaff = async (req, res) => {
  const { id } = req.params;

  try {
    const staff = await Staff.findOne({ _id: id });

    if (!staff) {
      return res.status(404).json({ error: "No such staff exists" });
    }

    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// create a new staff
const createStaff = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin Access Required" });
  }

  

  try {
    const staff = await Staff.create({
      ...req.body
    });

    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a staff
const deleteStaff = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin Access Required" });
  }

  const { id } = req.params;

  try {
    const staff = await Staff.findOneAndDelete({ _id: id }, { new: true });

    if (!staff) {
      return res.status(404).json({ error: "No such staff exists" });
    }

    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update a staff info
const updateStaff = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin Access Required" });
  }

  const { id } = req.params;

  try {
    const staff = await Staff.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({ error: "No such staff exists" });
    }

    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getStaffs,
  getStaff,
  createStaff,
  deleteStaff,
  updateStaff,
};
