import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Box, RadioGroup, FormControlLabel, Radio, FormControl } from "@mui/material";
import CardList from "../components/CardList";
import StudentHeader from "../components/StudentHeader";
import Chatbot from "./Chatbot";

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [cvUrl, setCvUrl] = useState(""); // Store student's CV URL
  const [filter, setFilter] = useState("All"); // New state for filter
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchStudentProfile(); 
    fetchAppliedJobs(); // Fetch student's CV
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
      setAppliedJobs(response.data.map((app) => app.jobId._id)); 
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
      setCvUrl(response.data.cv || ""); 
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

  const handleFilterChange = (event) => {
    setFilter(event.target.value); // Set the selected filter
  };

  // Filter jobs based on the selected category
  const filteredJobs = filter === "All" ? jobs : jobs.filter((job) => job.title === filter);

  return (
    <>
      <StudentHeader />
      <Container maxWidth="lg" sx={{ marginTop: "100px", display: "flex", gap: 4}}>
        {/* Left Section - Filter Options */}
        <Box sx={{ width: "20%", textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Filter Jobs</Typography>
          <FormControl component="fieldset">
            <RadioGroup value={filter} onChange={handleFilterChange} sx={{ display: "flex"}}>
              <FormControlLabel value="All" control={<Radio />} label="All" />
              <FormControlLabel value="Frontend" control={<Radio />} label="Frontend" />
              <FormControlLabel value="backend" control={<Radio />} label="Backend" />
              <FormControlLabel value="UI/UX" control={<Radio />} label="UI/UX" />
              <FormControlLabel value="Data Science" control={<Radio />} label="Data Science" />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Right Section - Job Listings */}
        <Box sx={{ width: "80%" }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>Available Jobs</Typography>
          <CardList jobs={filteredJobs} appliedJobs={appliedJobs} applyForJob={applyForJob} />
        </Box>
        <Chatbot/>
      </Container>
    </>
  );
};

export default StudentDashboard;
