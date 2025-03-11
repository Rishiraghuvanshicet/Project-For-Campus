import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Container, Typography, Select, MenuItem, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, 
  CircularProgress, Button, IconButton, Link 
} from "@mui/material";
import { Cancel } from "@mui/icons-material"; // Import cross-circle icon

const CollegeAdminApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/v1/job/college", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchApplicants = async (jobId) => {
    if (!jobId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:4000/api/v1/application/applicants/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(applicants)
      setApplicants(response.data || []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobChange = (event) => {
    setSelectedJob(event.target.value);
    fetchApplicants(event.target.value);
  };

  // Accept or Reject an Applicant
  const handleDecision = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/v1/application/update-status/${applicationId}`,
        { status }, // Send the updated status
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI instantly without refetching
      setApplicants((prevApplicants) =>
        prevApplicants.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
    }
  };

  // Delete an Applicant
  const handleDelete = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/v1/application/delete/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted applicant from UI
      setApplicants((prevApplicants) => prevApplicants.filter((app) => app._id !== applicationId));
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
        View Job Applicants
      </Typography>

      <Select value={selectedJob} onChange={handleJobChange} fullWidth displayEmpty>
        <MenuItem value="" disabled>Select a Job</MenuItem>
        {jobs.map((job) => (
          <MenuItem key={job._id} value={job._id}>{job.title}</MenuItem>
        ))}
      </Select>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>CV</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
                <TableCell align="right"><strong>Remove</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <TableRow key={applicant._id}>
                    <TableCell>{applicant.studentId.name}</TableCell>
                    <TableCell>{applicant.studentId.email}</TableCell>
                    <TableCell>
                      {applicant.studentId.cv ? (
                        <Link 
                          href={applicant.studentId.cv} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ color: "blue", fontWeight: "bold" }}
                        >
                          CV
                        </Link>
                      ) : (
                        <Typography sx={{ color: "gray" }}>No CV uploaded</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography 
                        sx={{ 
                          color: applicant.status === "Accepted" ? "green" : 
                                 applicant.status === "Rejected" ? "red" : "gray",
                          fontWeight: "bold" 
                        }}>
                        {applicant.status || "Pending"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ mr: 1 }}
                        disabled={applicant.status === "Accepted"}
                        onClick={() => handleDecision(applicant._id, "Accepted")}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        disabled={applicant.status === "Rejected"}
                        onClick={() => handleDecision(applicant._id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleDelete(applicant._id)}
                        sx={{
                          color: "gray",
                          transition: "color 0.3s",
                          "&:hover": { color: "red" }
                        }}
                      >
                        <Cancel />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No applicants found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default CollegeAdminApplicants;
