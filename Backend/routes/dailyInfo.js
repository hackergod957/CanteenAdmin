const express = require("express");
const dailyInfo = require("../models/dailyInfo");
const { getDailyInfos, getTodaysInfo, exportTodaysInfo } = require("../controllers/dailyInfo");

const dailyInfoRouter = express.Router();

dailyInfoRouter.get("/", getDailyInfos);
dailyInfoRouter.get("/today",getTodaysInfo)
dailyInfoRouter.get("/today/export",exportTodaysInfo)

module.exports = dailyInfoRouter;
