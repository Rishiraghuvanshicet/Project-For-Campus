const express = require("express");
const { applyForJob, getApplicantsByJob, getAppliedJobsByStudent, updateApplicationStatus, deleteApplication, getApplicationCountByJob, updateScheduledTime } = require("../controller/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/apply", authMiddleware, applyForJob); // Apply for a job(view that student had applied)
router.get("/applicants/:jobId", authMiddleware, getApplicantsByJob); // Get applicants for a job for admin
router.get("/getAppliedJobs", authMiddleware, getAppliedJobsByStudent); // Fetch applied jobs for a student
router.put("/update-status/:id", authMiddleware, updateApplicationStatus); // update the status
router.delete("/delete/:id", authMiddleware, deleteApplication);
router.get("/countByJob", authMiddleware, getApplicationCountByJob); // New route
router.put("/schedule-time/:id", authMiddleware, updateScheduledTime);// Time Schedule Route

module.exports = router;
