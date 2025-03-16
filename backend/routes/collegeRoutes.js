const express = require("express");
const { registerCollege, getAllColleges, getCollegeById, updateCollegeDetails, deleteCollege, getCollegeDetails, getTotalStudentsByCollege } = require("../controller/collegeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authMiddleware, registerCollege);// For CollegeAdmin
router.get("/all", authMiddleware, getAllColleges); // For MainAdmin
// router.get("/:id", authMiddleware, getCollegeById);
router.put("/update", authMiddleware, updateCollegeDetails); // For CollegeAdmin
router.delete("/:id", authMiddleware, deleteCollege); // For CollegeAdmin
router.get("/college-details", authMiddleware, getCollegeDetails); // For CollegeAdmin
router.get("/getTotalStudentsByCollege", authMiddleware, getTotalStudentsByCollege);



module.exports = router;
