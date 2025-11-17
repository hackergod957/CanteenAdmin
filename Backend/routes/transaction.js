const express = require("express");
const { purchaseFood } = require("../controllers/transaction");

const transactionRouter = express.Router();

transactionRouter.post('/buy',purchaseFood)

module.exports = transactionRouter