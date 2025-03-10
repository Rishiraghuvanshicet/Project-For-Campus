const Application = require("../models/applicationSchema");
const Job = require("../models/jobSchema");
const User = require("../models/userSchema");

// Apply for a Job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const studentId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existingApplication = await Application.findOne({ studentId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: "Already applied" });
    }

    const newApplication = new Application({ studentId, jobId });
    await newApplication.save();

    res.status(201).json({ 
      message: "Job application submitted successfully", 
      jobId: jobId  // Return the applied job ID
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get Applicants for a Job (College Admin View)
const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Find applications and populate student details
    const applicants = await Application.find({ jobId }).populate("studentId", "name email");

    if (!applicants.length) {
      return res.status(404).json({ message: "No applicants found for this job" });
    }

    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Applied Jobs by Student
const getAppliedJobsByStudent = async (req, res) => {
  try {
    const studentId = req.user._id;
    const appliedJobs = await Application.find({ studentId }).populate("jobId", "title description");
    
    if (!appliedJobs.length) {
      return res.status(404).json({ message: "No Applications", success: false });
    }
    
    res.status(200).json(appliedJobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// PUT /api/v1/application/update-status/:id
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params; // Application ID
    const { status } = req.body; // "Accepted" or "Rejected"

    // Validate status value
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find application and update status
    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: `Application ${status} successfully`, application });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//delete

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params; // Application ID

    // Find and delete application
    const application = await Application.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { applyForJob, getApplicantsByJob, getAppliedJobsByStudent, updateApplicationStatus, deleteApplication };
