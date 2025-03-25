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
    cvUrl: "",  // Store CV URL separately
    cvFile: null, // Store the file separately
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/v1/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({
          name: response.data.name,
          email: response.data.email,
          cvUrl: response.data.cv, // Ensure it fetches the correct URL
          cvFile: null,
          password: "",
        });
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
        cvFile: file, // Store the selected file
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
      if (userData.cvFile) {
        formData.append("cv", userData.cvFile); // Only send if a new file is selected
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
            alignItems: "center",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            {isEditing ? "Edit Profile" : "Profile Details"}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "20px" }}>
            {/* Name */}
            {isEditing ? (
              <TextField fullWidth label="Name" name="name" value={userData.name} onChange={handleInputChange} sx={{ marginBottom: "16px" }} />
            ) : (
              <Typography variant="body1" sx={{ marginBottom: "16px" }}><strong>Name:</strong> {userData.name}</Typography>
            )}

            {/* Email */}
            {isEditing ? (
              <TextField fullWidth label="Email" name="email" value={userData.email} onChange={handleInputChange} sx={{ marginBottom: "16px" }} />
            ) : (
              <Typography variant="body1" sx={{ marginBottom: "16px" }}><strong>Email:</strong> {userData.email}</Typography>
            )}

            {/* Password */}
            {isEditing ? (
              <TextField fullWidth label="Password" name="password" type="password" value={userData.password} onChange={handleInputChange} sx={{ marginBottom: "16px" }} />
            ) : (
              <Typography variant="body1" sx={{ marginBottom: "16px" }}><strong>Password:</strong> ********</Typography>
            )}

            {/* CV Upload */}
            {isEditing ? (
              <>
                <Button variant="outlined" component="label" sx={{ marginBottom: "16px", color: "orangered", borderColor: "orangered" }}>
                  Upload CV
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {userData.cvFile && <Typography variant="body2">{userData.cvFile.name}</Typography>}
              </>
            ) : (
              <Typography variant="body1" sx={{ marginBottom: "16px" }}>
                <strong>CV:</strong> {userData.cvUrl ? <a href={userData.cvUrl} target="_blank" rel="noopener noreferrer">View CV</a> : "No CV Uploaded"}
              </Typography>
            )}
          </Box>

          {/* Edit/Save Button */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            {isEditing ? (
              <Button variant="contained" onClick={handleSave} sx={{ marginTop: "16px", width: "200px", backgroundColor: "orangered", color: "white", "&:hover": { backgroundColor: "#d43f3f" } }}>
                Save Changes
              </Button>
            ) : (
              <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ marginTop: "16px", width: "200px", backgroundColor: "orangered", color: "white", "&:hover": { backgroundColor: "#d43f3f" } }}>
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
