import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterCollege = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: College Form | Step 2: Admin Form
  const [collegeData, setCollegeData] = useState({
    name: "",
    registrationNumber: "",
    location: "",
  });
  const [collegeId, setCollegeId] = useState("");

  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    role: "collegeAdmin",
    registrationNumber: "", // Include registration number
  });

  const handleCollegeChange = (e) => {
    setCollegeData({ ...collegeData, [e.target.name]: e.target.value });
  };

  const handleAdminChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const registerCollege = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    if (!/^[0-9]{6}$/.test(collegeData.registrationNumber)) {
      toast.error("Registration number must be exactly 6 digits.");
      return;
    }
    if (!collegeData.name.trim() || !collegeData.location.trim()) {
      toast.error("College name and location cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/college/register",
        collegeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCollegeId(collegeData.registrationNumber); // Set collegeId as registrationNumber
      setAdminData((prev) => ({ ...prev, registrationNumber: collegeData.registrationNumber }));
      toast.success("College registered successfully!");
      setStep(2); // Move to the next step
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register college.");
    }
  };

  const registerCollegeAdmin = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    if (!adminData.email.includes("@")) {
      toast.error("Enter a valid email for College Admin.");
      return;
    }
    if (adminData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/v1/user/register",
        adminData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("College Admin onboarded successfully!");
      setTimeout(() => navigate("/main-admin/dashboard"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register college admin.");
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer position="top-right" autoClose={1500} />

      {step === 1 ? (
        <Box
          sx={{
            mt: 5,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            boxShadow: 3, // Adds box shadow
            borderRadius: 2, // Optional: Adds rounded corners
            padding: 3,
            backgroundColor: "white", // Optional: Adds a white background
          }}
        >
          <Typography variant="h4" gutterBottom>
            Register College
          </Typography>
          <Box component="form" onSubmit={registerCollege} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="College Name"
              name="name"
              value={collegeData.name}
              onChange={handleCollegeChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Registration Number"
              name="registrationNumber"
              value={collegeData.registrationNumber}
              onChange={handleCollegeChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={collegeData.location}
              onChange={handleCollegeChange}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#6a1b9a", // Purple color
                "&:hover": {
                  backgroundColor: "#8e24aa", // Lighter purple on hover
                },
              }}
              fullWidth
            >
              Register College
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            mt: 5,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            boxShadow: 3,
            borderRadius: 2,
            padding: 3,
            backgroundColor: "white",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Register College Admin
          </Typography>
          <Box component="form" onSubmit={registerCollegeAdmin} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Admin Name"
              name="name"
              value={adminData.name}
              onChange={handleAdminChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Admin Email"
              name="email"
              type="email"
              value={adminData.email}
              onChange={handleAdminChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Admin Password"
              name="password"
              type="password"
              value={adminData.password}
              onChange={handleAdminChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="College Registration Number"
              name="registrationNumber"
              value={adminData.registrationNumber}
              margin="normal"
              disabled
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#6a1b9a",
                "&:hover": {
                  backgroundColor: "#8e24aa",
                },
              }}
              fullWidth
            >
              Register College Admin
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default RegisterCollege;
