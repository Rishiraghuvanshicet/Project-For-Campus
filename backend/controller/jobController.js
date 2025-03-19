const Job = require("../models/jobSchema");

// Create a new job By CollegeAdmin
const createJob = async (req, res) => {
  try {
    if (req.user.role !== "collegeAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, location, requirements, salary } = req.body;
    if (!title || !description || !requirements || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = new Job({
      title,
      description,
      location,
      requirements,
      salary,
      postedBy: req.user._id,
      collegeId: req.user.collegeId,
    });
    await job.save();
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all jobs posted by the college
const getJobsByCollege = async (req, res) => {
  try {
    if (!req.user || !req.user.collegeId) {
      return res.status(401).json({ message: "Unauthorized: Missing college ID" });
    }

    const jobs = await Job.find({ collegeId: req.user.collegeId });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//get One Job Detail For Student 
const getSingleJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure only the college admin who posted it can delete
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this job" });
    }

    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a job
const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { title, description, requirements, location } = req.body;

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure only the college admin who posted it can update
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this job" });
    }

    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { title, description, requirements, location },
      { new: true }
    );

    res.status(200).json({ message: "Job updated successfully", updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTotalJobsByCollege = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "collegeAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobCount = await Job.countDocuments({ collegeId: req.user.collegeId });

    res.status(200).json({ totalJobs: jobCount });
  } catch (error) {
    console.error("Error fetching job count:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getJobPostingTimeline = async (req, res) => {
  try {
    const collegeId = req.user.collegeId; // Extract collegeId from authenticated user

    // Fetch jobs for the college
    const jobs = await Job.find({ collegeId }).select("createdAt");

    // Group jobs by date
    const jobTimeline = jobs.reduce((acc, job) => {
      const date = job.createdAt.toISOString().split("T")[0]; // Extract YYYY-MM-DD
      acc[date] = (acc[date] || 0) + 1; // Count jobs per date
      return acc;
    }, {});

    // Convert object to array format for frontend
    const timelineData = Object.entries(jobTimeline).map(([date, count]) => ({
      date,
      count,
    }));

    res.status(200).json({ success: true, timeline: timelineData });
  } catch (error) {
    console.error("Error fetching job posting timeline:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createJob, getJobsByCollege, getSingleJobDetails, deleteJob, updateJob, getTotalJobsByCollege,getJobPostingTimeline };
