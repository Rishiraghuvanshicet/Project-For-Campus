import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Radio, RadioGroup, FormControlLabel, FormLabel, Input } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [cvUploading, setCvUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    registrationNumber: "",
    cv: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false); // New state for OTP sent status
  const [otpError, setOtpError] = useState(false); // State to handle OTP verification error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCvUploading(true);
    const cvFormData = new FormData();
    cvFormData.append("file", file);
    cvFormData.append("upload_preset", "CHANDAN-SRMS");

    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/dx4ctlu0h/upload", cvFormData);
      setFormData((prevFormData) => ({
        ...prevFormData,
        cv: response.data.secure_url,
      }));
      toast.success("CV uploaded successfully!");
    } catch (error) {
      toast.error("CV upload failed!");
    } finally {
      setCvUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!formData.email.endsWith("@gmail.com")) {
      toast.error("Email must be a Gmail account (example@gmail.com)!");
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    // CV validation for students
    if (formData.role === "student" && !formData.cv) {
      toast.error("Please upload your CV before registering!");
      return;
    }

    try {
      if (!otpSent) {
        // Step 1: Send OTP to the email
        const response = await axios.post("http://localhost:4000/api/v1/user/request-otp", { email: formData.email });
        
        // If OTP is sent successfully
        toast.success(response.data.message);
        setOtpSent(true);
      } else {
        // Step 2: Verify OTP
        const response = await axios.post("http://localhost:4000/api/v1/user/verify-otp", { email: formData.email, otp: formData.otp });
        
        // If OTP verification is successful, proceed with registration
        toast.success(response.data.message);
        
        // Proceed to register the user
        const registrationResponse = await axios.post("http://localhost:4000/api/v1/user/register", formData);
        toast.success(registrationResponse.data.message);
        
        // Redirect to home page after successful registration
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      if (otpSent && error.response?.data?.message === "Invalid OTP") {
        setOtpError(true);  // Handle incorrect OTP
      } else {
        toast.error(error.response?.data?.message || "Registration failed!");
      }
    }
  };

  return (
    <Box sx={styles.pageContainer}>
      <Container maxWidth="sm">
        <ToastContainer position="top-right" autoClose={3000} />
        <Box sx={styles.formContainer}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Form fields */}
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <FormLabel component="legend">Select Role:</FormLabel>
              <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
                <FormControlLabel value="student" control={<Radio />} label="Student" />
              </RadioGroup>
            </Box>
            {(formData.role === "collegeAdmin" || formData.role === "student") && (
              <TextField
                fullWidth
                label="College ID"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                margin="normal"
                required
              />
            )}
            {formData.role === "student" && (
              <Box sx={styles.cvUploadContainer}>
                <Typography variant="body1">Upload CV (PDF Only)</Typography>
                <Input type="file" accept="application/pdf" onChange={handleFileChange} required />
              </Box>
            )}
            {otpSent && (
              <TextField
                fullWidth
                label="Enter OTP"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                margin="normal"
                required
                error={otpError}  // Highlight error if OTP is incorrect
                helperText={otpError && "Incorrect OTP, please try again!"}
              />
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={cvUploading}>
              {otpSent ? "Verify OTP" : "Register"}
            </Button>
            <Typography sx={{ mt: 2, textAlign: "center" }}>
              Already have an account?{" "}
              <span onClick={() => navigate("/")} style={styles.link}>
                Login
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
    backgroundImage:
      "url('https://snckollam.ac.in/kezoofti/2019/10/campus-placement.jpg')",
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
  link: {
    color: "#1976d2",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Register;
