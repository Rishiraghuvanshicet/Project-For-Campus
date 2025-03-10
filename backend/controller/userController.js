const User = require("../models/userSchema");
const College = require("../models/collegeSchema"); // Import College model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    let { name, email, password, role, registrationNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // If the role is "collegeAdmin", ensure the registrationNumber is valid
    let collegeId = null;
    if (role === "collegeAdmin" || role === "student") {
      const college = await College.findOne({ registrationNumber });
      if (!college) {
        return res
          .status(400)
          .json({ message: "Invalid Registration Number. College not found." });
      }
      collegeId = college._id; // Assign the correct collegeId
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
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
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
  res.status(200).json(req.user);
};

module.exports = { register, login, logout, getAllUsers, getUserProfile };
