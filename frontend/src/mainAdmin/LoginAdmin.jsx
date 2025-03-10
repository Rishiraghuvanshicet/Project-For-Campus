import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "mainAdmin", // Default role selection
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle radio button change
  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        formData
      );

      // Store token & user details in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login successful!");

      // Navigate based on role
      if (formData.role === "mainAdmin") {
        navigate("/main-admin/dashboard");
      } else if (formData.role === "collegeAdmin") {
        navigate("/college-admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Invalid credentials. Try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h4">Login</Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {/* Email Input */}
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />

        {/* Password Input */}
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />

        {/* Role Selection */}
        <FormLabel sx={{ mt: 2 }}>Select Role</FormLabel>
        <RadioGroup row value={formData.role} onChange={handleRoleChange}>
          <FormControlLabel
            value="mainAdmin"
            control={<Radio />}
            label="Main Admin"
          />
          <FormControlLabel
            value="collegeAdmin"
            control={<Radio />}
            label="College Admin"
          />
          <FormControlLabel
            value="student"
            control={<Radio />}
            label="Student"
          />
        </RadioGroup>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>

      {/* Link to Register */}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Don't Have an Account? <Link to="/register">Register</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginAdmin;
