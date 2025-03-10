const express = require("express");
const {
  register,
  login,
  logout,
  getAllUsers,
  getUserProfile,
} = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout); // !! editing required
router.get("/profile", authMiddleware, getUserProfile);
router.get("/all", authMiddleware, getAllUsers); // Only for Admin

module.exports = router;
