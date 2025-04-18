const express = require("express");
const { getJobsByCollege, createJob , deleteJob, updateJob , getSingleJobDetails, getTotalJobsByCollege, getJobPostingTimeline } = require("../controller/jobController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/create", createJob); //for CollegeAdmin
router.get("/college", getJobsByCollege); // both CollegeAdmin And Student 
router.get("/college/:id", getSingleJobDetails ) //For  Student
router.delete("/:jobId", deleteJob); // Delete a job for CollegeAdmin
router.put("/:jobId", updateJob); // Update job for CollegeAdmin
router.get("/getTotalJobsByCollege", getTotalJobsByCollege);
router.get("/getJobPostingTimeline",getJobPostingTimeline);
module.exports = router;
