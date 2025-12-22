const express = require("express");
const {
  getMenu,
  getAllMenu,
  createMenu,
  deleteMenu,
  updateMenu,
  getTodayMenu,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menu");
const { authenticateToken } = require("../controllers/auth");
const menuRouter = express.Router();

menuRouter.get("/", getAllMenu);
menuRouter.get("/today", getTodayMenu);
menuRouter.get("/:date", getMenu);

menuRouter.post("/",authenticateToken,createMenu);
menuRouter.delete("/:date",authenticateToken ,deleteMenu);
menuRouter.patch("/:date", authenticateToken,updateMenu);
menuRouter.patch(
  "/:date/:type/:itemId",
  authenticateToken,
  updateMenuItem
);
menuRouter.delete(
  "/:date/:type/:itemId",
  authenticateToken,
  deleteMenuItem
);

module.exports = menuRouter;
