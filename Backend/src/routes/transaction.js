const express = require("express");
const {
  purchaseFood,
  getExcelByStudent,
  getAllTransactionRecord,
  getTodayExcel,
  getDateInfo,
  getExcelByDate,
  getStudentTransaction
} = require("../controllers/transaction");

const transactionRouter = express.Router();

transactionRouter.post('/buy', purchaseFood);

transactionRouter.get('/export/:studentId', getExcelByStudent);
transactionRouter.get('/today/export', getTodayExcel);
transactionRouter.get('/', getAllTransactionRecord);

transactionRouter.get('/date/:bsDate', getDateInfo);            
transactionRouter.get('/date/:bsDate/export', getExcelByDate); 
transactionRouter.get('/student/:studentId', getStudentTransaction);

module.exports = transactionRouter;
