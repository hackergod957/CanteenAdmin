const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const DailyInfo = require("../models/dailyInfo");
const Student = require("../models/student");
const excelJs = require("exceljs");
const NepaliDate = require("nepali-date-converter");
const bsToAd = require("../utils/bsToAd");
const adToBs = require("../utils/adToBs");

// to create file at 8 am every day
cron.schedule("0 8 * * * ", () => {
  const DailyScheduler = async () => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(todayDate.getDate() + 1);
    let dailyInfo = await DailyInfo.findOne({
      date: { $gte: todayDate, $lt: tomorrowDate },
    });
    await Student.updateMany({}, { $set: { status: false } });
    if (dailyInfo) {
      console.log(
        "DailyInfo Already  exists for today . skipping creation ...."
      );
      return;
    }

    try {
      const students = await Student.find({}).sort({ id: 1 });
      const idArray = students.map(({ _id }) => _id);
      dailyInfo = await DailyInfo.create({
        studentsWhoDidNotEat: idArray,
        totalEarning: 0,
        studentsWhoAte: [],
      });
      console.log(dailyInfo);
    } catch (error) {
      console.error("Daily Info couldn't be created", error);
    }
  };
  DailyScheduler();
});

//to get daily infos
const getDailyInfos = async (req, res) => {
  try {
    const dailyInfo = await DailyInfo.find({}).sort({ date: 1 });
    res.status(200).json(dailyInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//to get dailyinfo by date
const getDateInfo = async (req, res) => {
  const { BsDate } = req.params;
  date = bsToAd(BsDate);
  const givenDate = new Date(date);
  givenDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(givenDate);
  tomorrowDate.setDate(givenDate.getDate() + 1);
  try {
    const dailyInfo = await DailyInfo.find({
      date: { $gte: givenDate, $lt: tomorrowDate },
    });
    res.status(200).json(dailyInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// to get todays daily info
const getTodaysInfo = async (req, res) => {
  const todaysDate = new Date();
  todaysDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(todaysDate);
  tomorrowDate.setDate(todaysDate.getDate() + 1);

  try {
    const info = await DailyInfo.find({
      date: { $gte: todaysDate, $lt: tomorrowDate },
    });
    res.status(200).json(info);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const exportTodaysInfo = (req, res) => {
  const todaysDate = new Date();
  todaysDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(todaysDate);
  tomorrowDate.setDate(todaysDate.getDate() + 1);
  excelExport(req, res, todaysDate, tomorrowDate);
};

const exportDateInfo = async (req, res) => {
  const { date } = req.params;
  const givenDate = new Date(date);
  givenDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(givenDate);
  tomorrowDate.setDate(givenDate.getDate() + 1);
  excelExport(req, res, givenDate, tomorrowDate);
};
const excelExport = async (req, res, date, dateTomorrow) => {
  try {
    const info = await DailyInfo.find({
      date: { $gte: date, $lt: dateTomorrow },
    }).populate(["studentsWhoDidNotEat", "studentsWhoAte"]);
    const workBook = new excelJs.Workbook();
    const workSheet = workBook.addWorksheet("Daily Info ");
    const bsDate = adToBs(date)
    if (!info || info.length == 0) {
      return res
        .status(404)
        .json({ error: `No Daily Info Found For ${bsDate} ` });
    }
    const todayInfo = info[0];

    const allStudents = [
      ...todayInfo.studentsWhoAte.map((student) => ({
        ...student._doc,
        status: "Ate",
      })),
      ...todayInfo.studentsWhoDidNotEat.map((student) => ({
        ...student._doc,
        status: "Did Not Eat",
      })),
    ];

    workSheet.columns = [
      { header: "Student ID", key: "studentId", width: 50 },
      { header: "Name", key: "name", width: 50 },
      { header: "Class", key: "classLevel", width: 50 },
      { header: "Role", key: "role", width: 50 },
      { header: "Status", key: "status", width: 30 },
      { header: "Balance", key: "balance", width: 30 },
    ];

    allStudents.forEach((student) => {
      workSheet.addRow(student);
    });

    workSheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename= "Todays_Report "'
    );

    await workBook.xlsx.write(res);

    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getDailyInfos,
  getTodaysInfo,
  getDateInfo,
  exportTodaysInfo,
  exportDateInfo,
};
