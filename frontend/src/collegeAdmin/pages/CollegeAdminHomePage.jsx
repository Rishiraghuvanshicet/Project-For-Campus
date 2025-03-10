import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const CollegeAdminHomePage = () => {
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    alert("Logout successful!");
    navigate("/"); // Redirect to login page
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        College Admin Panel
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
        <Link to="/college-admin-dashboard">Go to Dashboard</Link>
        <Link to="/college-admin-post-job">Post a Job</Link>
        <Link to="/college-admin-applicants">View Jobs</Link>
        <Link to="/college-admin-Students-applicants">Students Applied For Job</Link>

      </Box>

      {/* ✅ Logout Button */}
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default CollegeAdminHomePage;
