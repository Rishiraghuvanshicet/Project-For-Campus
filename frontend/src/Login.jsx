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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student", // Default role
    collegeId: "", // Required only for students & college admins
  });

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle role selection
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData({ ...formData, role: selectedRole, collegeId: "" }); // Reset collegeId when role changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    // ✅ Basic Validation
    if (!formData.email || !formData.password || !formData.role) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if ((formData.role === "collegeAdmin" || formData.role === "student") && !formData.collegeId) {
      toast.error("College ID is required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/v1/user/login", formData);
      const { token, user } = response.data;

      toast.success("Login successful!");

      // ✅ Store user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("id", user._id);
      localStorage.setItem("collegeId", user.collegeId || ""); // Store only if available

      // ✅ Redirect user based on role
      setTimeout(() => {
        navigate(user.role === "collegeAdmin" ? "/college-admin-home-page" : "/student-dashboard");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={styles.container}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          {/* ✅ Role Selection */}
           <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
           <FormLabel component="legend">Select Role:</FormLabel>
           <RadioGroup row name="role" value={formData.role} onChange={handleRoleChange}>
           <FormControlLabel value="collegeAdmin" control={<Radio />} label="College Admin" />
           <FormControlLabel value="student" control={<Radio />} label="Student" />
           </RadioGroup>
           </Box>
         

          {/* ✅ College ID Field (Only for College Admin & Student) */}
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
            Login
          </Button>

          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Don't have an account? <span onClick={() => navigate("/register")} style={styles.link}>Register</span>
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

export default Login;
