const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const mongoose = require("mongoose");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      console.log(" No token provided");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      console.log(" User not found after decoding token");
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Ensure collegeId is an ObjectId
    if (req.user.collegeId) {
      req.user.collegeId = new mongoose.Types.ObjectId(req.user.collegeId);
    }

    next();
  } catch (error) {
    console.log(" Token verification failed", error.message);
    res.status(500).json({ message: "Token verification failed" });
  }
};


module.exports = authMiddleware;
