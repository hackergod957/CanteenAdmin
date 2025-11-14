const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const DailyInfo = require("../models/dailyInfo");
const student = require("../models/student");

const DailyScheduler = async () => {
  const date = new Date();
  const dailyInfo = await DailyInfo.findOne({ date: date });
  if (!dailyInfo) {
    throw new Error("Daily Info already exists");
  }
  cron.schedule("0 8 * * * ", () => {
    const createDocument = async () => {
      try {
        const students = await student.find({}).sort({ id: 1 });
        const idArray = students.map(({ _id }) => _id);
        const dailyInfo = await DailyInfo.create({
          studentsWhoDidNotEat: idArray,
          totalEarning: 0,
          studentsWhoAte: [],
        });
      } catch (error) {
        throw new Error("Daily Info couldn't be created");
      }
    };

    createDocument();
  });
};
