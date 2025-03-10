import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Link, MenuItem } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // Allow user to select the role
    collegeId: "", // Required for collegeAdmin & student
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/v1/user/register", formData);
      alert(response.data.message);
      navigate("/"); // Redirect to login
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h4">User Registration</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" required />

        {/* Role Selection */}
        <TextField
          select
          fullWidth
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          margin="normal"
          required
        >
          <MenuItem value="mainAdmin">Main Admin</MenuItem>
          <MenuItem value="collegeAdmin">College Admin</MenuItem>
          <MenuItem value="student">Student</MenuItem>
        </TextField>

        {/* Show collegeId field only for collegeAdmin & student */}
        {(formData.role === "collegeAdmin" || formData.role === "student") && (
          <TextField
            fullWidth
            label="College ID"
            name="collegeId"
            value={formData.collegeId}
            onChange={handleChange}
            margin="normal"
            required
          />
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </Box>

      {/* Login Link */}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Already have an account?{" "}
          <Link href="/" underline="hover" color="primary">
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterAdmin;
