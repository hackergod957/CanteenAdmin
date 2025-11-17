const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/student");
const Menu = require("../models/menu");
const Transaction = require("../models/transaction");
const DailyInfo = require("../models/dailyInfo");
const excelJs = require('exceljs')


const excelExport = async (req, res,student) => {
  try {
    const transaction = await Transaction.find({
        student
    }).populate('student').populate('dailyInfo').sort({createdAt : -1});
    const workBook = new excelJs.Workbook();
    const workSheet = workBook.addWorksheet("Daily Info ");

  


    workSheet.columns = [
      { header: "Transaction ID", key: "_id", width: 70 },
      { header: "Student ID", key: "student.studentId", width: 70 },
      { header: "Student Name", key: "student.Name", width: 70 },
      { header: "Class", key: "classLevel", width: 70 },
      { header: "Date", key: "date", width: 70 },
      {header : "Time" , key : "time", width:70},
      { header: "Items", key: "items", width: 30 },
      { header: "Total Amount", key: "totalAmount", width: 70 },
    ];

    transaction.forEach((transaction) => {
      workSheet.addRow(transaction);
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
const getStudentTransaction = async (req, res) => {
   const studentId = req.params;
   try{
    const student = await Student.findOne({studentId:studentId})
    const transaction = await Transaction.findOne({
        student
    }).populate('student').populate('dailyInfo').sort({createdAt : -1});

    excelExport(req, res,student)
   } 
   catch(error){
    res.status(400).json({error : error.message})
   }
}


const purchaseFood = async (req, res) => {
  const { studentId, items } = req.body;
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(date);
  tomorrowDate.setDate(date.getDate() + 1);
  let totalAmount = 0;
  

  const session = await mongoose.startSession()
  session.startTransaction()
  try{
      const student = await Student.findOne({ studentId: studentId },{session : session});
      if (!student) {
        res.status(404).json({ error: "The student doesn't exist" });
        return;
      }
      const menu = await Menu.findOne({ date: { $gte: date, $lt: tomorrowDate } },{session : session});
      const dailyInfo = await DailyInfo.findOne({date: { $gte: date, $lt: tomorrowDate}},{session: session})
      const allItems = [
          ...menu.dishes.map((item) => item),
          ...menu.snacks.map((item) => item),
          ...menu.desserts.map((item) => item),
        ];
        
        
        for (item of items) {
            let response = allItems.find(({ Name }) => item.Name === Name);
            if (!response) {
                res.status(404).json({ error: "The Food Item doesn't exist" });
                return;
            }
            totalAmount += item.price;
        }
        
        if(student.balance < totalAmount){
            res.status(400).json({error : "Balance isn't enough"})
            return
        }
        
        await Student.updateOne({studentId: studentId},{$inc : {balance : -totalAmount}},{session : session})
        
        await DailyInfo.updateOne({_id: dailyInfo.id},{$inc:{totalEarning : totalAmount}},{session : session})

        await DailyInfo.updateOne({_id:dailyInfo.id},{$pull: {studentsWhoDidNotEat: studentId}, $push: {studentsWhoAte : studentId}}, {session : session})

        const transaction = await Transaction.create([{
            student,
            dailyInfo,
            items,
            totalAmount,
            status : "Completed"
        }], {session : session})
        
        await session.commitTransaction()
        await session.endSession()

        res.status(200).json({mssg : "Successful Transaction"})

  }
  catch(error){
    res.status(400).json({error : error.message})
    await session.abortTransaction()
  }
  finally{
    await session.endSession()
  }

    



};

module.exports = {
  purchaseFood,
};
