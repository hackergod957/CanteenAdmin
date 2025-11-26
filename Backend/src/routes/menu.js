const express = require("express");
const {
  getMenu,
  getAllMenu,
  createMenu,
  deleteMenu,
  updateMenu,
  getTodayMenu,
} = require("../controllers/menu");
const { authenticateToken } = require("../controllers/auth");
const menuRouter = express.Router();

menuRouter.get("/", getAllMenu);
menuRouter.get("/today", getTodayMenu);
menuRouter.get("/:date", getMenu);

menuRouter.post("/",authenticateToken,createMenu);
menuRouter.delete("/:date",authenticateToken ,deleteMenu);
menuRouter.patch("/:date", authenticateToken,updateMenu);

module.exports = menuRouter;
