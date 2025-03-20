import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CollegeAdminHeader from "../components/CollegeAdminHeader";

const CollegeAdminViewApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [editMode, setEditMode] = useState(null); // Track which job is being edited
  const [updatedJob, setUpdatedJob] = useState({}); // Store updated job details

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/v1/job/college",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs(response.data);
    } catch (error) {
      toast.error("Failed to fetch jobs!");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/v1/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job deleted successfully!");
      setTimeout(() => setJobs(jobs.filter((job) => job._id !== jobId)), 1000);
    } catch (error) {
      toast.error("Failed to delete job!");
    }
  };

  const handleEditClick = (job) => {
    setEditMode(job._id);
    setUpdatedJob({ ...job });
  };

  const handleInputChange = (e, field) => {
    setUpdatedJob({ ...updatedJob, [field]: e.target.value });
  };

  const handleSave = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:4000/api/v1/job/${jobId}`, updatedJob, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job updated successfully!");
      setJobs(jobs.map((job) => (job._id === jobId ? updatedJob : job)));
      setEditMode(null); // Exit edit mode
    } catch (error) {
      toast.error("Failed to update job!");
    }
  };

  return (
    <>
      <CollegeAdminHeader />
      <Container maxWidth="md">
        <ToastContainer position="top-right" autoClose={1000} />
        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Typography variant="h4"><b>Jobs Posted by College</b></Typography>
          <Typography variant="h6" sx={{ mt: 2, color: "gray" }}>
            Total Jobs: {jobs.length}
          </Typography>
        </Box>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Job Title</strong>
                </TableCell>
                <TableCell>
                  <strong>Location</strong>
                </TableCell>
                <TableCell>
                  <strong>Requirements</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell>
                      {editMode === job._id ? (
                        <TextField
                          value={updatedJob.title}
                          onChange={(e) => handleInputChange(e, "title")}
                          size="small"
                        />
                      ) : (
                        job.title
                      )}
                    </TableCell>
                    <TableCell>
                      {editMode === job._id ? (
                        <TextField
                          value={updatedJob.location}
                          onChange={(e) => handleInputChange(e, "location")}
                          size="small"
                        />
                      ) : (
                        job.location
                      )}
                    </TableCell>
                    <TableCell>
                      {editMode === job._id ? (
                        <TextField
                          value={updatedJob.requirements}
                          onChange={(e) => handleInputChange(e, "requirements")}
                          size="small"
                        />
                      ) : (
                        job.requirements
                      )}
                    </TableCell>
                    <TableCell>
                      {editMode === job._id ? (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleSave(job._id)}
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEditClick(job)}
                        >
                          Update
                        </Button>
                      )}
                      &nbsp;
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(job._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No jobs posted yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default CollegeAdminViewApplicants;
