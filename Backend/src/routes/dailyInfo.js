const express = require("express");
const dailyInfo = require("../models/dailyInfo");
const { getDailyInfos, getTodaysInfo, exportTodaysInfo, exportDateInfo, getDateInfo } = require("../controllers/dailyInfo");

const dailyInfoRouter = express.Router();

dailyInfoRouter.get("/", getDailyInfos);
dailyInfoRouter.get("/today",getTodaysInfo)
dailyInfoRouter.get("/:BsDate",getDateInfo)
dailyInfoRouter.get("/export/:date",exportDateInfo)
dailyInfoRouter.get("/today/export",exportTodaysInfo)

module.exports = dailyInfoRouter;
