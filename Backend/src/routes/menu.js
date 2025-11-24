const express = require("express");
const {
  getMenu,
  getAllMenu,
  createMenu,
  deleteMenu,
  updateMenu,
  getTodayMenu,
} = require("../controllers/menu");
const menuRouter = express.Router();

menuRouter.get("/", getAllMenu);
menuRouter.get("/today", getTodayMenu);
menuRouter.get("/:date", getMenu);
menuRouter.post("/", createMenu);
menuRouter.delete("/:date", deleteMenu);
menuRouter.patch("/:date", updateMenu);

module.exports = menuRouter;
