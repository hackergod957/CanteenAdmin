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
menuRouter.get("/:bsDate", getMenu);

menuRouter.post("/",authenticateToken,createMenu);
menuRouter.delete("/:bsDate",authenticateToken ,deleteMenu);
menuRouter.patch("/:bsDate", authenticateToken,updateMenu);
menuRouter.patch(
  "/:bsDate/:type/:itemId",
  authenticateToken,
  updateMenuItem
);
menuRouter.delete(
  "/:bsDate/:type/:itemId",
  authenticateToken,
  deleteMenuItem
);

module.exports = menuRouter;
