const { userModel } = require("../model/userSch");
const bcryptjs = require("bcryptjs");
const { secretKey, APassword } = require("../config/config");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res) => {
  const { Name, Email, Password, ConfirmPassword, Role, AdminPassword } =
    req.body;

  try {
    if (!Name || !Email || !Password || !ConfirmPassword || !Role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (Role === "admin" && AdminPassword !== APassword) {
      return res.status(400).json({ error: "Invalid admin password" });
    }

    const hashedPassword = await bcryptjs.hash(Password, 10);

    const newUser = new userModel({
      Name,
      Email,
      Password: hashedPassword,
      ProfileImage: req.file.filename,
      Role,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in userSignUp:", error);
    res.status(500).json({ error: "An error occurred while signing up" });
  }
};

const userSignIn = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await userModel.findOne({ Email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(Password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokenPayload = {
      userId: user._id,
      role: user.Role,
    };

    const token = jwt.sign(tokenPayload, secretKey);

    res.status(200).json({
      token,
      userId: user._id,
      role: user.Role,
      message: "User signed in successfully",
    });
  } catch (error) {
    console.error("Error in userSignIn:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProfileImage = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const profileImage = user.ProfileImage;
    res.status(200).json({ profileImage });
  } catch (error) {
    console.error("Error in getProfileImage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const protectedRoute = (req, res) => {
  res.json({ message: "This is a protected route." });
};

const getRegisteredUser = async (req, res) => {
  try {
    const users = await userModel.find({}, { Password: 0 });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in getRegisteredUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteIndividualRegisteredUser = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }

    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteIndividualRegisteredUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserAnalytics = async (req, res) => {
  try {
    const { timeRange, analyticsType, timeZone } = req.query;

    const currentDate = new Date();
    const options = { timeZone: timeZone };

    let startDate;
    let endDate = new Date();

    switch (timeRange) {
      case "today":
        startDate = new Date(currentDate.toLocaleDateString(undefined, options));
        break;
      case "yesterday":
        startDate = new Date(currentDate.toLocaleDateString(undefined, options));
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "week":
        startDate = new Date(currentDate.toLocaleDateString(undefined, options));
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate = new Date(currentDate.toLocaleDateString(undefined, options));
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate = new Date(currentDate.toLocaleDateString(undefined, options));
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0);
        break;
    }

    let analyticsData;

    switch (analyticsType) {
      case "users":
        analyticsData = await userModel.countDocuments({
          createdAt: { $gte: startDate, $lt: endDate },
        });
        break;

      default:
        analyticsData = [];
        break;
    }

    res.status(200).json([{ Name: timeRange, Total: analyticsData }]);
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ userName: user.Name });
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  userSignUp,
  userSignIn,
  getProfileImage,
  protectedRoute,
  getRegisteredUser,
  deleteIndividualRegisteredUser,
  getUserAnalytics,
  getUserInfo
};