import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";

const StudentEditProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    cv: "",
    password: "*****",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/v1/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prevData) => ({
        ...prevData,
        cv: file,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      if (userData.password) {
        formData.append("password", userData.password);
      }
      if (userData.cv) {
        formData.append("cv", userData.cv);
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:4000/api/v1/user/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        navigate("/student-dashboard");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <>
      <StudentHeader />
      <Container maxWidth="sm" sx={{ marginTop: "100px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center align the box content
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            {isEditing ? "Edit Profile" : "Profile Details"}
          </Typography>

          {/* Name */}
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start", // Center align the box content
            padding: "20px"
          }}>
          {isEditing ? (
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              sx={{
                marginBottom: "16px",
                textAlign: "left", // Left align the input
              }}
            />
          ) : (
            <Typography variant="body1" sx={{ marginBottom: "16px", textAlign: "left" }}>
              <strong>Name:</strong> {userData.name}
            </Typography>
          )}

          {/* Email */}
          {isEditing ? (
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              sx={{
                marginBottom: "16px",
                textAlign: "left",
              }}
            />
          ) : (
            <Typography variant="body1" sx={{ marginBottom: "16px", textAlign: "left" }}>
              <strong>Email:</strong> {userData.email}
            </Typography>
          )}

          {/* Password */}
          {isEditing ? (
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={userData.password}
              onChange={handleInputChange}
              sx={{
                marginBottom: "16px",
                textAlign: "left",
              }}
            />
          ) : (
            <Typography variant="body1" sx={{ marginBottom: "16px", textAlign: "left" }}>
              <strong>Password:</strong> {`********`}
            </Typography>
          )}

          {/* CV Upload */}
          {isEditing ? (
            <div>
              <Button variant="outlined" component="label" sx={{ marginBottom: "16px" }}>
                Upload CV
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {userData.cv && <Typography variant="body2">{userData.cv.name}</Typography>}
            </div>
          ) : (
            <Typography variant="body1" sx={{ marginBottom: "16px", textAlign: "left" }}>
              <strong>CV:</strong> {userData.cv ? <a href={`${userData.cv}`} target="_blank" rel="noopener noreferrer">View CV</a> : "No CV Uploaded"}
            </Typography>
          )}
            </Box>
          {/* Edit/Save Button */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            {isEditing ? (
              <Button
                variant="contained"
                color="orangered"
                onClick={handleSave}
                sx={{
                  marginTop: "16px",
                  width: "200px",
                  color:"white",
                  backgroundColor: "orangered", // orangered color
                  "&:hover": {
                    backgroundColor: "#d43f3f", // darker orangered on hover
                  },
                }}
              >
                Save Changes
              </Button>
            ) : (
              <Button
                variant="contained"
                color="orangered"
                onClick={() => setIsEditing(true)}
                sx={{
                  marginTop: "16px",
                  width: "200px",
                  color:"white",
                  backgroundColor: "orangered", // orangered color
                  "&:hover": {
                    backgroundColor: "#d43f3f", // darker orangered on hover
                  },
                }}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </Box>
      </Container>
    </>
  );
};

export default StudentEditProfile;
