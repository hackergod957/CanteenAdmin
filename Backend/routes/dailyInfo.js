const express = require("express");
const dailyInfo = require("../models/dailyInfo");
const { getDailyInfos, getTodaysInfo, exportTodaysInfo, exportDateInfo, getDateInfo } = require("../controllers/dailyInfo");

const dailyInfoRouter = express.Router();

dailyInfoRouter.get("/", getDailyInfos);
dailyInfoRouter.get("/today",getTodaysInfo)
dailyInfoRouter.get("/:date",getDateInfo)
dailyInfoRouter.get("/export/:date",exportDateInfo)
dailyInfoRouter.get("/export/today",exportTodaysInfo)

module.exports = dailyInfoRouter;
