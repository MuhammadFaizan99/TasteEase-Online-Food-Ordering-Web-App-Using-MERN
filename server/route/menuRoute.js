const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const menuRouter = express.Router();
const multer = require("multer");
const { createMenu, getMenu, deleteMenuJob } = require("../controller/menu");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

menuRouter.post("/createMenu", verifyToken, upload.single("image"), createMenu);
menuRouter.get("/getMenu", verifyToken, getMenu);
menuRouter.get("/deleteMenuAt8", verifyToken, async (req, res) => {
  await deleteMenuJob();
  res.json({ message: "Menu deletion scheduled at 8:00 AM" });
});

module.exports = { menuRouter };
