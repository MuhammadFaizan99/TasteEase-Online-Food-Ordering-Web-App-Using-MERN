const { chefModel } = require("../model/chefSch");

const createTeam = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    const { Name, Experience, Role, Speciality } = req.body;
    const Image = req.file ? req.file.filename : "";

    const newChef = new chefModel({
      Name,
      Experience,
      Role,
      Speciality,
      Image,
    });

    const savedChef = await newChef.save();

    res.status(201).json(savedChef);
  } catch (error) {
    console.error("Error creating chef:", error);
    res.status(500).json({ error: "Error creating chef" });
  }
};

const getTeam = async (req, res) => {
  try {
    const team = await chefModel.find();
    res.status(200).json(team);
  } catch (error) {
    console.error("Error getting team:", error);
    res.status(500).json({ error: "Error getting team" });
  }
};

module.exports = { createTeam, getTeam };
