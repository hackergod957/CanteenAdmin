const mongoose = require("mongoose");
const Menu = require("../models/menu");
const bsToAd = require("../utils/bsToAd");

//get all menus
const getAllMenu = async (req, res) => {
  try {
    const menus = await Menu.find({}).sort({ id: 1 });
    res.status(200).json(menus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get a menu
const getMenu = async (req, res) => {
  const { bsDate } = req.params;
  const date = bsToAd(bsDate);
  const givenDate = new Date(date);
  givenDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(givenDate);
  tomorrowDate.setDate(givenDate.getDate() + 1);

  try {
    const menu = await Menu.findOne({
      date: { $gte: givenDate, $lt: tomorrowDate },
    });

    if (!menu) {
      res.status(404).json({ error: "No such Menu exits" });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTodayMenu = async (req, res) => {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);

  try {
    const menu = await Menu.findOne({
      date: { $gte: todayDate, $lt: tomorrowDate },
    });

    if (!menu) {
      res.status(404).json({ error: "No such Menu exits" });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//create a new Menu
const createMenu = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin Access Required" });
  }
  try {
    const menu = await Menu.create({
      ...req.body,
    });

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a menu
const deleteMenu = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin Access Required" });
  }
  const { bsDate } = req.params;
  const date = bsToAd(bsDate);
  const givenDate = new Date(date);
  givenDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(givenDate);
  tomorrowDate.setDate(givenDate.getDate() + 1);

  try {
    const menu = await Menu.findOneAndDelete(
      { date: { $gte: givenDate, $lt: tomorrowDate } },
      { new: true }
    );

    if (!menu) {
      res.status(404).json({ error: "No such Menu exits" });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMenu = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin Access Required" });
  }
  const { bsDate } = req.params;
  const date = bsToAd(bsDate);
  const givenDate = new Date(date);
  givenDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(givenDate);
  tomorrowDate.setDate(givenDate.getDate() + 1);

  try {
    const menu = await Menu.findOneAndUpdate(
      { date: { $gte: givenDate, $lt: tomorrowDate } },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!menu) {
      res.status(404).json({ error: "No such Menu exits" });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin Access Required" });
  }

  const { bsDate, type, itemId } = req.params;
  const date = bsToAd(bsDate);
  if (!["dishes", "snacks", "dessert"].includes(type)) {
    return res.status(400).json({ error: "Invalid menu type" });
  }

  const givenDate = new Date(date);
  givenDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(givenDate);
  tomorrowDate.setDate(givenDate.getDate() + 1);

  const updateFields = {};
  for (const key in req.body) {
    updateFields[`${type}.$.${key}`] = req.body[key];
  }

  try {
    const menu = await Menu.findOneAndUpdate(
      {
        date: { $gte: givenDate, $lt: tomorrowDate },
        [`${type}._id`]: itemId,
      },
      { $set: updateFields },
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({ error: "Menu or item not found" });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteMenuItem = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin Access Required" });
  }

  const { bsdate, type, itemId } = req.params;
  const date = bsToAd(bsDate);

  if (!["dishes", "snacks", "dessert"].includes(type)) {
    return res.status(400).json({ error: "Invalid menu type" });
  }

  const givenDate = new Date(date);
  givenDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(givenDate);
  tomorrowDate.setDate(givenDate.getDate() + 1);

  try {
    const menu = await Menu.findOneAndUpdate(
      { date: { $gte: givenDate, $lt: tomorrowDate } },
      { $pull: { [type]: { _id: itemId } } },
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({ error: "Menu or item not found" });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { deleteMenuItem };

module.exports = {
  getAllMenu,
  getTodayMenu,
  getMenu,
  createMenu,
  updateMenu,
  updateMenuItem,
  deleteMenu,
  deleteMenuItem,
};
