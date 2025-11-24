const mongoose = require("mongoose");
const Menu = require("../models/menu");

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
  const { date } = req.params;
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
  const { date } = req.params;
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

//update a menu info
const updateMenu = async (req, res) => {
  const { date } = req.params;
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

module.exports = {
  getAllMenu,
  getTodayMenu,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
};
