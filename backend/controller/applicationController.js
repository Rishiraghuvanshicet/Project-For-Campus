const Application = require("../models/applicationSchema");
const Job = require("../models/jobSchema");
const User = require("../models/userSchema");

// Apply for a Job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const studentId = req.user._id;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if the student has already applied
    const existingApplication = await Application.findOne({ studentId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: "Already applied" });
    }

    // Fetch the student's CV URL from the User model
    const student = await User.findById(studentId);
    if (!student || !student.cv) {
      return res.status(400).json({ message: "CV is required to apply for jobs" });
    }

    // Create a new job application with the student's CV URL
    const newApplication = new Application({
      studentId,
      jobId,
      cvUrl: student.cv, // Attach student's CV URL
    });

    await newApplication.save();

    res.status(201).json({ 
      message: "Job application submitted successfully", 
      application: newApplication 
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get Applicants for a Job (College Admin View)
const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Find applications and populate student details along with CV URL
    const applicants = await Application.find({ jobId })
      .populate("studentId", "name email cv"); // Include CV URL

    if (!applicants.length) {
      return res.status(404).json({ message: "No applicants found for this job" });
    }

    res.status(200).json(applicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
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
