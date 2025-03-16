import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";

const CollegeAdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active page based on the current route
  const getActivePage = () => {
    if (location.pathname === "/college-admin-home-page") return "home";
    if (location.pathname === "/college-admin-dashboard") return "dashboard";
    if (location.pathname === "/college-admin-post-job") return "post-job";
    if (location.pathname === "/college-admin-applicants") return "view-jobs";
    if (location.pathname === "/college-admin-Students-applicants") return "students-applied";
    return "";
  };

  const [activePage, setActivePage] = useState(getActivePage());

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "white",
        padding: "8px 16px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <Typography variant="h6" sx={{ fontFamily: "Times New Roman, serif", fontWeight: "bold" }}>
          <span style={{ color: "black" }}>Campus</span>{" "}
          <span style={{ color: "orangered" }}>Recruitment</span>{" "}
          <span style={{ color: "black" }}>System</span>
        </Typography>

        {/* Navigation Links */}
        
        <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexGrow: 1 }}>
        <Button
            sx={{ color: activePage === "home" ? "orangered" : "black" }}
            component={Link}
            to="/college-admin-home-page"
            onClick={() => setActivePage("home")}
          >
            Home
          </Button>
          <Button
            sx={{ color: activePage === "dashboard" ? "orangered" : "black" }}
            component={Link}
            to="/college-admin-dashboard"
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </Button>
          <Button
            sx={{ color: activePage === "post-job" ? "orangered" : "black" }}
            component={Link}
            to="/college-admin-post-job"
            onClick={() => setActivePage("post-job")}
          >
            Post a Job
          </Button>
          <Button
            sx={{ color: activePage === "view-jobs" ? "orangered" : "black" }}
            component={Link}
            to="/college-admin-applicants"
            onClick={() => setActivePage("view-jobs")}
          >
            View Jobs
          </Button>
          <Button
            sx={{ color: activePage === "students-applied" ? "orangered" : "black" }}
            component={Link}
            to="/college-admin-Students-applicants"
            onClick={() => setActivePage("students-applied")}
          >
            Students Applied
          </Button>
        </Box>

        {/* Logout Button */}
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default CollegeAdminHeader;