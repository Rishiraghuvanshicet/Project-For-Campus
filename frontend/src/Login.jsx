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
    role: "student",
    collegeId: "",
  });

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Trigger login on Enter key press
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  // Handle role selection
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData({ ...formData, role: selectedRole, collegeId: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("id", user._id);
      localStorage.setItem("collegeId", user.collegeId || "");

      setTimeout(() => {
        navigate(user.role === "collegeAdmin" ? "/college-admin-home-page" : "/student-dashboard");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <Box sx={styles.pageContainer}>
      <Container maxWidth="sm">
        <ToastContainer position="top-right" autoClose={3000} />
        <Box sx={styles.formContainer}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
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
              onKeyDown={handleChange}
              margin="normal"
              required
              autoComplete="off"
              sx={styles.inputField}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleChange}
              margin="normal"
              required
              autoComplete="off"
              sx={styles.inputField}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <FormLabel component="legend">Select Role:</FormLabel>
              <RadioGroup row name="role" value={formData.role} onChange={handleRoleChange}>
                <FormControlLabel value="collegeAdmin" control={<Radio />} label="College Admin" />
                <FormControlLabel value="student" control={<Radio />} label="Student" />
              </RadioGroup>
            </Box>

            {(formData.role === "collegeAdmin" || formData.role === "student") && (
              <TextField
                fullWidth
                label="College ID"
                name="collegeId"
                value={formData.collegeId}
                onChange={handleChange}
                onKeyDown={handleChange}
                margin="normal"
                required
                sx={styles.inputField}
              />
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>

            <Typography sx={{ mt: 2, textAlign: "center" }}>
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")} style={styles.link}>
                Register
              </span>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundImage: "url('https://snckollam.ac.in/kezoofti/2019/10/campus-placement.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
  },
  formContainer: {
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  inputField: {
    "& input:-webkit-autofill": {
      boxShadow: "0 0 0px 1000px white inset !important",
      border: "1px solid #ccc !important",
    },
  },
  link: {
    color: "#1976d2",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;
