import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CollegeAdminHeader from "../components/CollegeAdminHeader";

const CollegeAdminPostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4000/api/v1/job/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job posted successfully!");
      setFormData({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salary: "",
      });
    } catch (error) {
      toast.error("Failed to post job!");
    }
  };

  return (
    <>
      <CollegeAdminHeader />
      <Container maxWidth="sm">
        <ToastContainer position="top-right" autoClose={3000} />
        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Typography variant="h4">Post a New Job</Typography>
        </Box>
        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Job Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "orangered",
                color: "white",
                "&:hover": { backgroundColor: "darkorange" },
              }}
            >
              Post Job
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default CollegeAdminPostJob;
