const { menuModel } = require("../model/menuSch");
const schedule = require("node-schedule");

const createMenu = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    const { name, description, price, time } = req.body;

    const newMenu = new menuModel({
      name,
      description,
      price,
      time,
      image: req.file.path,
    });

    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the menu item" });
  }
};

const getMenu = async (req, res) => {
  try {
    const menus = await menuModel.find();
    res.status(200).json(menus);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the menu" });
  }
}

const deleteMenuJob = async () => {
  try {
    await menuModel.deleteMany({});
    console.log("Menu deleted successfully at 8:00 AM.");
  } catch (error) {
    console.error("Error deleting menu:", error);
  }
};

module.exports = { createMenu, getMenu, deleteMenuJob };
