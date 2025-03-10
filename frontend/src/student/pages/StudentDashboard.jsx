import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Button, Box } from "@mui/material";
import CardList from "../components/CardList";

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
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
      setAppliedJobs(response.data.map((app) => app.jobId._id)); // Store jobIds of applied jobs
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  const applyForJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/v1/application/apply",
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 201) {
        alert("Application submitted successfully!"); // Show success message
        setAppliedJobs((prev) => [...prev, jobId]); // Update applied jobs state
      }
    } catch (error) {
      console.error("Error applying for job:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Application failed.");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Student Dashboard
        </Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="h6" color="primary">
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
  );
};

export default StudentDashboard;
