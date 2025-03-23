import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Import the user icon

const StudentHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Dropdown menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Handle Menu Open and Close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Handle Edit Profile
  const handleEditProfile = () => {
    navigate("/student-dashboard/editprofile");
    handleMenuClose(); // Close the menu after redirect
  };

  // Determine active page based on the current route
  const getActivePage = () => {
    if (location.pathname === "/student-dashboard") return "home";
    if (location.pathname === "/student-dashboard/applied-jobs") return "applied-jobs";
    if (location.pathname === "/student-dashboard") return "status";
    return "";
  };

  const [activePage, setActivePage] = useState(getActivePage());

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

        {/* User Profile Dropdown */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{ color: "black" }}
        >
          <AccountCircleIcon />
        </IconButton>

        {/* Menu for Edit Profile and Logout */}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default StudentHeader;
