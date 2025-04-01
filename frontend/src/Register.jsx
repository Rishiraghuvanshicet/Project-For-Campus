import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Input,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [cvUploading, setCvUploading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    registrationNumber: "",
    cv: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!otpSent) {
        const response = await axios.post(
          "http://localhost:4000/api/v1/user/request-otp",
          { email: formData.email }
        );
        toast.success(response.data.message);
        setOtpSent(true);
      } else if (!otpVerified) {
        const response = await axios.post(
          "http://localhost:4000/api/v1/user/verify-otp",
          { email: formData.email, otp: formData.otp }
        );
        toast.success(response.data.message);
        setOtpVerified(true);
        setOtpError(false);
      } else {
        const registrationResponse = await axios.post(
          "http://localhost:4000/api/v1/user/register",
          formData
        );
        toast.success(registrationResponse.data.message);
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      if (
        otpSent &&
        !otpVerified &&
        error.response?.data?.message === "Invalid OTP"
      ) {
        setOtpError(true);
      } else {
        toast.error(error.response?.data?.message || "Process failed!");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <Box sx={styles.pageContainer}>
      <Container maxWidth="sm">
        <ToastContainer position="top-right" autoClose={3000} />
        <Box sx={styles.formContainer}>
          <Typography
            variant="h4"
            sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
          >
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              autoComplete="off"
              value={formData.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
              margin="normal"
              required
            />
            {otpSent && (
              <TextField
                fullWidth
                label="Enter OTP"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                margin="normal"
                required
                autoComplete="off"
                error={otpError}
                helperText={otpError ? "Incorrect OTP, please try again!" : ""}
              />
            )}
            {otpVerified && (
              <>
                <TextField
                  fullWidth
                  label="College ID"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
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
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={cvUploading}
            >
              {!otpSent ? "Send OTP" : !otpVerified ? "Verify OTP" : "Register"}
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
