import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, TextField, Button, Grid } from "@mui/material";
import axios from "axios";
import CollegeAdminHeader from "../components/CollegeAdminHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles for react-toastify

const CollegeAdminDashBoard = () => {
  const [collegeDetails, setCollegeDetails] = useState({
    name: "",
    registrationNumber: "",
    location: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch college details from the backend
  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized! Please log in again.");
          return;
        }

        const response = await axios.get("http://localhost:4000/api/v1/college/college-details", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCollegeDetails(response.data);
      } catch (error) {
        console.error("Error fetching college details:", error);
        alert("Failed to fetch college details.");
      }
    };

    fetchCollegeDetails();
  }, []);

  // Handle input changes for editing
  const handleChange = (e) => {
    setCollegeDetails({ ...collegeDetails, [e.target.name]: e.target.value });
  };

  // Update college details (PUT request)
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! Please log in again.");
        return;
      }

      await axios.put(
        "http://localhost:4000/api/v1/college/update",
        collegeDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Show success toast
      toast.success("College details updated successfully!", {
        position: "top-right",
        autoClose: 5000, // Duration for toast visibility
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating college details:", error);
      alert("Failed to update college details.");
    }
  };

  return (
    <>
      <CollegeAdminHeader />
      <Container maxWidth="sm"> {/* Reduced maxWidth for better form alignment */}
        <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
            <b>College Admin Dashboard</b>
          </Typography>

          <Paper elevation={3} sx={{ p: 4, width: "100%", textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              College Details
            </Typography>

            {isEditing ? (
              <Box component="form" sx={{ width: "100%", mt: 2 }}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="College Name"
                      name="name"
                      value={collegeDetails.name}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Registration Number"
                      name="registrationNumber"
                      value={collegeDetails.registrationNumber}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={collegeDetails.location}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                    <Button variant="contained" color="success" onClick={handleUpdate}>
                      Save Changes
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography><strong>Name:</strong> {collegeDetails.name}</Typography>
                <Typography><strong>Registration No:</strong> {collegeDetails.registrationNumber}</Typography>
                <Typography><strong>Location:</strong> {collegeDetails.location}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    mt: 2,
                    backgroundColor: "orangered",
                    color: "white",
                    "&:hover": { backgroundColor: "darkorange" },
                  }}
                >
                  Edit Details
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>

      {/* Toast Container for notifications */}
      <ToastContainer />
    </>
  );
};

export default CollegeAdminDashBoard;
