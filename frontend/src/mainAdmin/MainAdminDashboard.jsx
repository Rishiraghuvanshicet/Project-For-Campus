import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainAdminDashboard = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/api/v1/college/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setColleges(response.data);
      } catch (error) {
        toast.error("Error fetching colleges!");
        console.error("Error fetching colleges:", error);
      }
    };

    fetchColleges();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found, please login again!");
        return;
      }
      localStorage.removeItem("token");
      toast.success("Logout successful!");
      setTimeout(() => navigate("/"), 2700); // Redirect after 2 sec
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed!");
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const handleDeleteCollege = async (id) => {
    try {
      const token = localStorage.getItem("token");
      
      // Find the college name before deleting
      const collegeToDelete = colleges.find(college => college._id === id);
      
      const response = await axios.delete(`http://localhost:4000/api/v1/college/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setColleges(colleges.filter((college) => college._id !== id));
  
      // Show success toast with backend message and college name
      toast.success(`${response.data.message}: ${collegeToDelete?.name}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting college!");
      console.error(
        "Error deleting college:",
        error.response?.data || error.message
      );
    }
  };
  

  return (
    <Container maxWidth="md">
      <ToastContainer position="top-right" autoClose={2000} />
      
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Main Admin Dashboard
        </Typography>
      </Box>

      <Box sx={{ textAlign: "right", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/main-admin/register-college")}
        >
          Register College
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>College Name</strong>
              </TableCell>
              <TableCell>
                <strong>Registration Number</strong>
              </TableCell>
              <TableCell>
                <strong>Location</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {colleges.length > 0 ? (
              colleges.map((college) => (
                <TableRow key={college._id}>
                  <TableCell>{college.name}</TableCell>
                  <TableCell>{college.registrationNumber}</TableCell>
                  <TableCell>{college.location}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#d32f2f",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#b71c1c" },
                      }}
                      onClick={() => handleDeleteCollege(college._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No colleges registered yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default MainAdminDashboard;
