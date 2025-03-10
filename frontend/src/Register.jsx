import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    registrationNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await console.log(formData)
      const response = await axios.post("http://localhost:4000/api/v1/user/register", formData);
      toast.success(response.data.message);
      setTimeout(() => navigate("/"), 1500); // Redirect after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={styles.container}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
          <TextField fullWidth type="email" label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" required />
          <TextField fullWidth type="password" label="Password" name="password" value={formData.password} onChange={handleChange} margin="normal" required />
          <TextField select fullWidth label="Role" name="role" value={formData.role} onChange={handleChange} margin="normal">
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="collegeAdmin">College Admin</MenuItem>
          </TextField>
          {formData.role !== "mainAdmin" && (
            <TextField fullWidth label="College ID" name="registrationNumber" value={formData.collegeId} onChange={handleChange} margin="normal" required />
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Already have an account? <span onClick={() => navigate("/")} style={styles.link}>Login</span>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

const styles = {
  container: {
    mt: 5,
    p: 4,
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
    textAlign: "center",
  },
  link: {
    color: "#1976d2",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Register;
