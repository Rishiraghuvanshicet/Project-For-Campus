import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterCollege = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    location: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation before submitting
    if (!/^\d{6}$/.test(formData.registrationNumber)) {
      toast.error("Registration number must be exactly 6 digits.");
      return;
    }
    if (!formData.name.trim() || !formData.location.trim()) {
      toast.error("College name and location cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        toast.error("Unauthorized! Please login again.");
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/v1/college/register",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message);
      setTimeout(() => navigate("/main-admin/dashboard"), 2000); // Redirect after success
    } catch (error) {
      console.error("College registration failed:", error);
      toast.error(error.response?.data?.message || "Failed to register college.");
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer position="top-right" autoClose={1500} />
      
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h4">Register College</Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="College Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Registration Number"
          name="registrationNumber"
          value={formData.registrationNumber}
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Register College
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterCollege;
