const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/config");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  try {
    const decodedToken = jwt.verify(token.replace("Bearer ", ""), secretKey);
    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = { verifyToken };
