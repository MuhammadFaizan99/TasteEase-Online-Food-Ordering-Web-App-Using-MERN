const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const teamRouter = express.Router();
const multer = require("multer");
const { createTeam, getTeam } = require("../controller/chef");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

teamRouter.post("/createTeam", verifyToken, upload.single("image"), createTeam);
teamRouter.get("/getTeam", verifyToken, getTeam);

module.exports = { teamRouter };
