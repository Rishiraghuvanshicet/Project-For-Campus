const User = require("../models/userSchema");
const College = require("../models/collegeSchema"); // Import College model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../config/nodemailer");

// Temporary storage for OTP (Ideally, use a DB or session storage for better security)
let storedOTP = ""; // You can store this in the database or session for real-world apps
let otpExpirationTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

const register = async (req, res) => {
  try {
    let { name, email, password, role, registrationNumber, cv } = req.body;
    console.log(registrationNumber);
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate registrationNumber for CollegeAdmins and Students
    let collegeId = null;
    if (role === "collegeAdmin" || role === "student") {
      const college = await College.findOne({ registrationNumber });
      if (!college) {
        return res.status(400).json({
          message: "Invalid Registration Number. College not found.",
        });
      }
      collegeId = college._id;
    }

    // Ensure CV is required for students
    if (role === "student" && !cv) {
      return res.status(400).json({ message: "CV is required for students" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      collegeId,
      cv, // ✅ Added CV field
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role, collegeId } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.role !== role) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const collegeRegNum = user.collegeId;
    const college = await College.findById(collegeRegNum);
    if (
      (role === "collegeAdmin" || role === "student") &&
      college.registrationNumber !== collegeId
    ) {
      console.log(" Mismatch: College ID does not match");
      return res.status(400).json({ message: "Invalid College ID" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, collegeId: user.collegeId },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId,
      },
    });
  } catch (error) {
    console.error(" Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const logout = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get all users (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get logged-in user details
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email cv"); // 🔥 Ensure cvUrl is included
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user._id;
    const cvUrl = req.file.path; // Assuming you use Cloudinary or local storage

    const user = await User.findByIdAndUpdate(userId, { cvUrl }, { new: true });

    res.status(200).json({ message: "CV uploaded successfully", cvUrl });
  } catch (error) {
    console.error("CV Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const requestOTP = async (req, res) => {
  const { email } = req.body;

  // Validate email format
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Send OTP to the email and store it temporarily
    storedOTP = await sendOTP(email);
    otpExpirationTime = Date.now() + 10 * 60 * 1000; // Reset OTP expiration time

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle OTP verification
const verifyOTP = (req, res) => {
  const { otp } = req.body;

  // Check if OTP is expired
  if (Date.now() > otpExpirationTime) {
    return res
      .status(400)
      .json({ message: "OTP has expired. Please request a new one." });
  }

  // Check if the entered OTP matches the stored OTP
  if (otp === storedOTP) {
    // OTP is correct, proceed with the verification process
    return res.status(200).json({ message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
};

module.exports = {
  register,
  verifyOTP,
  requestOTP,
  login,
  logout,
  getAllUsers,
  getUserProfile,
  uploadCV,
};
