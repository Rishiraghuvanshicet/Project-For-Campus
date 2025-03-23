import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 

const CollegeAdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
          <Button sx={{ color: activePage === "home" ? "orangered" : "black" }} component={Link} to="/college-admin-home-page" onClick={() => setActivePage("home")}>
            Home
          </Button>
          <Button sx={{ color: activePage === "dashboard" ? "orangered" : "black" }} component={Link} to="/college-admin-dashboard" onClick={() => setActivePage("dashboard")}>
            Dashboard
          </Button>
          <Button sx={{ color: activePage === "post-job" ? "orangered" : "black" }} component={Link} to="/college-admin-post-job" onClick={() => setActivePage("post-job")}>
            Post a Job
          </Button>
          <Button sx={{ color: activePage === "view-jobs" ? "orangered" : "black" }} component={Link} to="/college-admin-applicants" onClick={() => setActivePage("view-jobs")}>
            View Jobs
          </Button>
          <Button sx={{ color: activePage === "students-applied" ? "orangered" : "black" }} component={Link} to="/college-admin-Students-applicants" onClick={() => setActivePage("students-applied")}>
            Students Applied
          </Button>
        </Box>

        {/* Dropdown Menu for Edit Profile and Logout */}
        <Box>
        <IconButton
          onClick={handleMenuClick}
          sx={{ color: "black" }}
        >
          <AccountCircleIcon />
        </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => { navigate("/college-admin-dashboard/college-admin-edit-profile"); handleMenuClose(); }}>
              Edit Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CollegeAdminHeader;
