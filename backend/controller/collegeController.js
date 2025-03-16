const express = require("express");
const College = require("../models/collegeSchema");
const User = require("../models/userSchema");

// Register College
const registerCollege = async (req, res) => {
  try {
    const { name, registrationNumber, location } = req.body;

    // Validation
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "College name must be a string" });
    }
    if (!/^\d{6}$/.test(registrationNumber)) {
      return res.status(400).json({ message: "Registration number must be exactly 6 digits" });
    }
    if (!location || typeof location !== "string") {
      return res.status(400).json({ message: "Location must be a string" });
    }

    const existingCollege = await College.findOne({ registrationNumber });
    if (existingCollege) {
      return res.status(400).json({ message: "College already registered" });
    }

    const newCollege = await College.create({
      name,
      registrationNumber,
      location,
      created_by: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, { collegeId: newCollege._id });

    res.status(201).json({ message: "College registered successfully", college: newCollege });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all colleges (For Main Admin)
const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.status(200).json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single college by ID
const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });

    res.status(200).json(college);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update College Details (NEW)
const updateCollegeDetails = async (req, res) => {
  try {
    const { name, registrationNumber, location } = req.body;
    const collegeId = req.user.collegeId; // Fetch collegeId from authenticated user

    if (!collegeId) {
      return res.status(400).json({ message: "College ID is required" });
    }

    const college = await College.findByIdAndUpdate(
      collegeId,
      { name, registrationNumber, location },
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.status(200).json({ message: "College details updated successfully", college });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete College
const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCollege = await College.findByIdAndDelete(id);

    if (!deletedCollege) {
      return res.status(404).json({ message: "College not found" });
    }

    res.status(200).json({ message: "College deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//get college detail for CollegeAdmin Portal
const getCollegeDetails = async (req, res) => {
  try {
    if (req.user.role !== "collegeAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!req.user.collegeId) {
      return res.status(400).json({ message: "College ID not assigned to this user" });
    }

    const college = await College.findById(req.user.collegeId);
    if (!college) {
      console.log("College not found in database");
      return res.status(404).json({ message: "College not found" });
    }
    res.status(200).json(college);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getTotalStudentsByCollege = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "collegeAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const studentCount = await User.countDocuments({ collegeId: req.user.collegeId, role: "student" });

    res.status(200).json({ totalStudents: studentCount });
  } catch (error) {
    console.error("Error fetching student count:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { registerCollege, getAllColleges, getCollegeById, updateCollegeDetails, deleteCollege, getCollegeDetails, getTotalStudentsByCollege };
