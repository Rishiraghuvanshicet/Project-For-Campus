import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Input,
  IconButton,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";

const Register = () => {
  const navigate = useNavigate();
  const [cvUploading, setCvUploading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [timer, setTimer] = useState(600);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    registrationNumber: "",
    cv: "",
  });

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp") setOtpError(false);
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCvUploading(true);
    const cvFormData = new FormData();
    cvFormData.append("file", file);
    cvFormData.append("upload_preset", "CHANDAN-SRMS");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dx4ctlu0h/upload",
        cvFormData
      );
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

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/request-otp",
        { email: formData.email }
      );
      toast.success(response.data.message);
      setOtpSent(true);
      setTimer(600);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP request failed!");
    }
  };

  const handleVerifyOtp = async () => {
    if (timer <= 0) {
      toast.error("OTP expired! Please request a new one.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/verify-otp",
        { email: formData.email, otp: formData.otp }
      );
      toast.success(response.data.message);
      setOtpVerified(true);
      setOtpError(false);
    } catch (error) {
      setOtpError(true);
      toast.error("Incorrect OTP! Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        formData
      );
      toast.success(response.data.message);
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <Box sx={styles.pageContainer}>
      <Container maxWidth="sm">
        <ToastContainer position="top-right" autoClose={3000} />
        <Box sx={styles.formContainer}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
            Register
          </Typography>
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              autoComplete="off"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="email"
              label="Email"
              autoComplete="off"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            {otpSent && (
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  fullWidth
                  label="Enter OTP"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  margin="normal"
                  required
                  autoComplete="off"
                  error={otpError}
                  helperText={otpError ? "Incorrect OTP, try again!" : ""}
                />
                <Typography variant="body2">{formatTime(timer)}</Typography>
                <IconButton
                  onClick={() => {
                    setTimer(600); // Reset the timer
                    handleSendOtp(); // Resend OTP
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Box>
            )}
            {otpVerified && (
              <>
                <TextField
                  fullWidth
                  label="College ID"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">Upload CV (PDF Only)</Typography>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required
                  />
                </Box>
              </>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={
                !otpSent
                  ? handleSendOtp
                  : !otpVerified
                  ? handleVerifyOtp
                  : handleRegister
              }
            >
              {!otpSent ? "Send OTP" : !otpVerified ? "Verify OTP" : "Register"}
            </Button>
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
