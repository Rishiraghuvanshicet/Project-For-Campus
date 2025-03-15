import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Button, Box } from "@mui/material";
import CardList from "../components/CardList";
import StudentHeader from "../components/StudentHeader";

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [cvUrl, setCvUrl] = useState(""); // Store student's CV URL
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchStudentProfile(); 
    fetchAppliedJobs();// Fetch student's CV
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/v1/job/college", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/v1/application/getAppliedJobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("hii2")
      setAppliedJobs(response.data.map((app) => app.jobId._id)); // Store applied job IDs
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/v1/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.cv)
      setCvUrl(response.data.cv || ""); // Store CV URL
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }
  };

  const applyForJob = async (jobId) => {
    try {
      if (!cvUrl) {
        alert("Please upload your CV before applying for jobs.");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/v1/application/apply",
        { jobId, cvUrl }, // Send CV URL with job application
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        alert("Application submitted successfully!");
        setAppliedJobs((prev) => [...prev, jobId]); // Update applied jobs state
      }
    } catch (error) {
      console.error("Error applying for job:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Application failed.");
    }
  };

  return (
    <>
    <StudentHeader/>
    <Container maxWidth="lg" sx={{marginTop:"100px"}}>
      <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Student Dashboard
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Jobs Applied: {appliedJobs.length}
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
          Available Jobs
        </Typography>

        <CardList
          jobs={jobs}
          appliedJobs={appliedJobs}
          applyForJob={applyForJob}
        />
      </Box>
    </Container>
    </>
  );
};

export default StudentDashboard;
