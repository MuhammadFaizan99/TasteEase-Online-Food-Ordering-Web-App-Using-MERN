const express = require("express");
const userRouter = express.Router();
const {
  userSignUp,
  userSignIn,
  getProfileImage,
  getRegisteredUser,
  deleteIndividualRegisteredUser,
  getUserAnalytics,
  getUserInfo
} = require("../controller/user");
const { verifyToken } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

userRouter.post("/signUp", upload.single("ProfileImage"), userSignUp);
userRouter.get("/getRegisteredUser", verifyToken, getRegisteredUser);
userRouter.delete("/deleteIndividualRegisteredUser",verifyToken,deleteIndividualRegisteredUser);
userRouter.post("/signIn", userSignIn);
userRouter.get("/profileImage", verifyToken, getProfileImage);
userRouter.get("/analytics", verifyToken, getUserAnalytics);
userRouter.get("/userInfo", verifyToken, getUserInfo);

module.exports = { userRouter };
