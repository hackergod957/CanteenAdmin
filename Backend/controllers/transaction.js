const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/student");
const Menu = require("../models/menu");
const Transaction = require("../models/transaction");
const DailyInfo = require("../models/dailyInfo");
const excelJs = require("exceljs");
const student = require("../models/student");

const excelExport = async (req, res, student) => {
  try {
    const transaction = await Transaction.find({
      student,
    })
      .populate("student")
      .populate("dailyInfo")
      .sort({ createdAt: -1 });
    const workBook = new excelJs.Workbook();
    const workSheet = workBook.addWorksheet(" Transaction Record ");

    workSheet.columns = [
      { header: "Transaction ID", key: "_id", width: 70 },
      { header: "Student ID", key: "studentId", width: 70 },
      { header: "Student Name", key: "name", width: 70 },
      { header: "Class", key: "classLevel", width: 70 },
      { header: "Date", key: "date", width: 70 },
      { header: "Time", key: "time", width: 70 },
      { header: "Items", key: "items", width: 30 },
      { header: "Total Amount", key: "totalAmount", width: 70 },
    ];

    transaction.forEach((transaction) => {
      workSheet.addRow({
        _id: transaction._id,
        studentId: transaction.student.studentId,
        name: transaction.student.name,
        classLevel: transaction.student.classLevel,
        items: transaction.items
          .map((item) => {
            return `${item.itemName} $${item.price}`;
          })
          .join(", "),
        date: transaction.createdAt.toISOString().split("T")[0],
        time: transaction.createdAt.toTimeString().split(" ")[0],
        totalAmount: transaction.totalAmount,
      });
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

const getAllTransactionRecord = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate("student")
      .populate("dailyInfo")
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getStudentTransaction = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findOne({ studentId: studentId });
    if (!student) {
      res.status(404).json({ error: "The student doesn't exist" });
      return;
    }
    const transaction = await Transaction.find({
      student,
    })
      .populate("student")
      .populate("dailyInfo")
      .sort({ createdAt: -1 });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getExcelByStudent = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOne({ studentId: studentId });
  if (!student) {
    res.status(404).json({ error: "The student doesn't exist" });
    return;
  }
  excelExport(req, res, student);
};

const purchaseFood = async (req, res) => {
  const { studentId, items } = req.body;
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(date);
  tomorrowDate.setDate(date.getDate() + 1);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const student = await Student.findOne(
      { studentId: studentId },
      {},
      { session: session }
    );
    if (!student) {
      res.status(404).json({ error: "The student doesn't exist" });
      return;
    }
    const menu = await Menu.findOne(
      { date: { $gte: date, $lt: tomorrowDate } },
      {},
      { session: session }
    );
    const dailyInfo = await DailyInfo.findOne(
      { date: { $gte: date, $lt: tomorrowDate } },
      {},
      { session: session }
    );
    const allItems = [
      ...menu.dishes.map((item) => item),
      ...menu.snacks.map((item) => item),
      ...menu.dessert.map((item) => item),
    ];
    let foundItems = [];
    for (item of items) {
      let response = allItems.find(
        (menuItem) => menuItem.name === item.itemName
      );
      if (!response) {
        res.status(404).json({ error: "The Food Item doesn't exist" });
        return;
      }
      foundItems.push(response)
    }

    let totalAmount = foundItems.reduce((sum,item) => sum + item.price,0)

    if (student.balance < totalAmount) {
      res.status(400).json({ error: "Balance isn't enough" });
      return;
    }

    await Student.updateOne(
      { studentId: studentId },
      { $inc: { balance: -totalAmount } },
      { session: session }
    );

    await DailyInfo.updateOne(
      { _id: dailyInfo.id },
      { $inc: { totalEarning: totalAmount } },
      { session: session }
    );

    await DailyInfo.updateOne(
      { _id: dailyInfo.id },
      {
        $pull: { studentsWhoDidNotEat: student._id },
        $push: { studentsWhoAte: student._id },
      },
      { session: session }
    );

    const transaction = await Transaction.create(
      [
        {
          student: student._id,
          dailyInfo: dailyInfo._id,
          foundItems,
          totalAmount,
          status: "completed",
        },
      ],
      { session: session }
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(200).json({ mssg: "Successful Transaction" });
  } catch (error) {
    res.status(400).json({ error: error.message });
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

module.exports = {
  purchaseFood,
  getAllTransactionRecord,
  getStudentTransaction,
  getExcelByStudent,
};
