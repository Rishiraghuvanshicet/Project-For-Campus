import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";

const StudentHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active page based on the current route
  const getActivePage = () => {
    if (location.pathname === "/student-dashboard") return "home";
    if (location.pathname === "/student-dashboard/applied-jobs") return "applied-jobs";
    if (location.pathname === "/student-dashboard") return "status";
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
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        
        <Typography variant="h6" sx={{ fontFamily: "Times New Roman, serif", fontWeight: "bold" }}>
          <span style={{ color: "black" }}>Campus</span>{" "}
          <span style={{ color: "orangered" }}>Recruitment</span>{" "}
          <span style={{ color: "black" }}>System</span>
        </Typography>

        {/* Middle Section: Navigation Links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            sx={{ color: activePage === "home" ? "orangered" : "black" }}
            component={Link}
            to="/student-dashboard"
            onClick={() => setActivePage("home")}
          >
            Home
          </Button>
          <Button
            sx={{ color: activePage === "applied-jobs" ? "orangered" : "black" }}
            component={Link}
            to="/student-dashboard/applied-jobs"
            onClick={() => setActivePage("applied-jobs")}
          >
            Applied Jobs
          </Button>
          <Button
            sx={{ color: activePage === "status" ? "orangered" : "black" }}
            component={Link}
            to="/student-dashboard"
            onClick={() => setActivePage("status")}
          >
            Status
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

export default StudentHeader;
