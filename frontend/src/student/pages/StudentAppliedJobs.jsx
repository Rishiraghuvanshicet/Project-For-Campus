import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; 
import { useNavigate } from "react-router-dom"; 
import StudentHeader from "../components/StudentHeader";

const StudentAppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/api/v1/application/getAppliedJobs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          if (response.data.length === 0) {
            setJobs([]); // No jobs applied
          } else {
            setJobs(response.data); // Set jobs if found
          }
          setError(null); // No error
        } else {
          throw new Error("Unexpected response from server.");
        }
      } catch (err) {
        setError("You have not applied for a job or Failed to fetch applied jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <>
      <StudentHeader />
      <Container sx={{ marginTop: "100px", textAlign: "center" }}>
        <Button
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate("/student-dashboard")}
          sx={{
            position: "absolute",
            top: "90px",
            left: "20px",
            backgroundColor: "#f0f0f0",
            color: "black",
            textTransform: "none",
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          Back
        </Button>

        <Typography variant="h4" gutterBottom>
          Jobs You've Applied For
        </Typography>

        {/* Show Loading Spinner */}
        {loading && <CircularProgress />}

        {/* Show API Error */}
        {!loading && error && (
          <Alert severity="error">{error}</Alert>
        )}

        {/* Show "No Jobs Applied" if API returns empty array */}
        {!loading && !error && jobs.length === 0 && (
          <Alert severity="info">You haven't applied for any jobs yet.</Alert>
        )}

        {/* Show Table If Jobs Exist */}
        {!loading && !error && jobs.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Job Title</b></TableCell>
                  <TableCell><b>Company</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Applied Date</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell>{job.jobId?.title || "N/A"}</TableCell>
                    <TableCell>{job.jobId?.companyName || "N/A"}</TableCell>
                    <TableCell>{job.status}</TableCell>
                    <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default StudentAppliedJobs;
