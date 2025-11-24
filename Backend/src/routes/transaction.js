const express = require("express");
const { purchaseFood, getExcelByStudent, getAllTransactionRecord, getTodayExcel } = require("../controllers/transaction");

const transactionRouter = express.Router();

transactionRouter.post('/buy',purchaseFood)
transactionRouter.get('/export/:studentId',getExcelByStudent)
transactionRouter.get('/today/export',getTodayExcel)
transactionRouter.get('/',getAllTransactionRecord)


module.exports = transactionRouter