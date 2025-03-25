const express = require("express");
const {
  register,
  login,
  logout,
  getAllUsers,
  getUserProfile,
  uploadCV,
  requestOTP, 
  verifyOTP,
  updateUser
} = require("../controller/userController");

const { upload } = require("../config/cloudinary");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); // 🔥 Changed to POST for better API design

router.get("/profile", authMiddleware, getUserProfile);
router.get("/all", authMiddleware, getAllUsers);

router.post("/upload-cv", authMiddleware, upload.single("cv"), uploadCV);

// Route for requesting OTP
router.post("/request-otp", requestOTP);
// Route for verifying OTP
router.post("/verify-otp", verifyOTP);

router.put("/profile", authMiddleware, upload.single("cv"), updateUser);

module.exports = router;
