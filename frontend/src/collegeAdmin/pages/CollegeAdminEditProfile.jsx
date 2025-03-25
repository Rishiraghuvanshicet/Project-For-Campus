import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CollegeAdminHeader from "../components/CollegeAdminHeader";

const CollegeAdminEditProfile = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    cv: null,
    role: "", // Added role field
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setAdminData({
          name: response.data.name,
          email: response.data.email,
          password: "", // Do not pre-fill password
          role: response.data.role || "", // Assuming role is returned from API
        });
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAdminData({ ...adminData, cv: e.target.files[0] });
  };

  console.log(adminData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", adminData.name);
      formData.append("email", adminData.email);
      if (adminData.password) formData.append("password", adminData.password);
      if (adminData.cv) formData.append("cv", adminData.cv);

      await axios.put("http://localhost:4000/api/v1/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <CollegeAdminHeader />
      <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", minHeight: "80vh", alignItems: "center" }}>
        <Box sx={{ width: "100%", boxShadow: 3, padding: 4, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Admin Profile
          </Typography>
          {!isEditing ? (
            <Box textAlign="left">
              <Typography variant="h6"><strong>Name:</strong> {adminData.name}</Typography>
              <Typography variant="h6"><strong>Email:</strong> {adminData.email}</Typography>
              {adminData.cv && typeof adminData.cv === "string" && (
                <Typography variant="h6">
                  <strong>CV:</strong> <a href={adminData.cv} target="_blank" rel="noopener noreferrer">View CV</a>
                </Typography>
              )}
              <Button
                variant="contained"
                sx={{ mt: 2, backgroundColor: "orangered", color: "white" }}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Name" name="name" value={adminData.name} onChange={handleChange} margin="normal" required />
              <TextField fullWidth label="Email" name="email" value={adminData.email} onChange={handleChange} margin="normal" required />
              <TextField fullWidth label="New Password" name="password" type="password" value={adminData.password} onChange={handleChange} margin="normal" />

              {/* Only render Upload CV if role is NOT collegeAdmin */}
              {adminData.role !== "collegeAdmin" && (
                <Box mt={2}>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: "none" }} id="cv-upload" />
                  <label htmlFor="cv-upload">
                    <Button variant="outlined" component="span" sx={{ color: "orangered", borderColor: "orangered" }}>
                      Upload CV
                    </Button>
                  </label>
                </Box>
              )}

              <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: "orangered", color: "white", mr: 1 }}>
                Save Changes
              </Button>
              <Button variant="outlined" sx={{ mt: 2, color: "orangered", borderColor: "orangered" }} onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </form>
          )}
        </Box>
      </Container>
    </>
  );
};

export default CollegeAdminEditProfile;
