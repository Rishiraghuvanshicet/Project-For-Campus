import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  IconButton,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Cancel, AccessTime } from "@mui/icons-material"; // AccessTime Icon
import CollegeAdminHeader from "../components/CollegeAdminHeader";

const CollegeAdminApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);

  const now = new Date().toISOString().slice(0, 16);

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
      setJobs(response.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchApplicants = async (jobId) => {
    if (!jobId) return;

    setLoading(true);
    setApplicants([]);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:4000/api/v1/application/applicants/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  const handleDecision = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/v1/application/update-status/${applicationId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
    }
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:4000/api/v1/application/delete/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplicants((prev) => prev.filter((app) => app._id !== applicationId));
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const handleExport = () => {
    if (applicants.length === 0) {
      alert("No applicants to export!");
      return;
    }

    const exportData = applicants.map((applicant) => ({
      Name: applicant.studentId.name,
      Email: applicant.studentId.email,
      "CV Link": applicant.studentId.cv || "No CV uploaded",
      Status: applicant.status || "Pending",
      "Scheduled Time": applicant.scheduledTime || "Not Scheduled", // Add Scheduled Time in export
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applicants");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "Applicants.xlsx");
  };

  const handleOpenDialog = (applicantId) => {
    setSelectedApplicantId(applicantId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setScheduledTime("");
  };

  const handleScheduleTime = async () => {
    if (!scheduledTime) {
      alert("Please select a schedule time.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/v1/application/schedule-time/${selectedApplicantId}`,
        { scheduledTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === selectedApplicantId ? { ...app, scheduledTime } : app
        )
      );
      setOpenDialog(false);
      alert("Scheduled time updated successfully!");
    } catch (error) {
      console.error("Error scheduling time:", error);
      alert("Failed to schedule time.");
    }
  };

  return (
    <>
      <CollegeAdminHeader />
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
          View Job Applicants
        </Typography>

        <Select
          value={selectedJob}
          onChange={handleJobChange}
          fullWidth
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select a Job
          </MenuItem>
          {jobs.map((job) => (
            <MenuItem key={job._id} value={job._id}>
              {job.title}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleExport}
          disabled={applicants.length === 0}
        >
          Extract to Excel
        </Button>

        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        ) : (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>CV</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Schedule Time</strong>
                  </TableCell>{" "}
                  {/* Schedule Time column */}
                  <TableCell align="right">
                    <strong>Remove</strong>
                  </TableCell>
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
                          >
                            View CV
                          </Link>
                        ) : (
                          <Typography sx={{ color: "gray" }}>
                            No CV uploaded
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color:
                              applicant.status === "Accepted"
                                ? "green"
                                : applicant.status === "Rejected"
                                ? "red"
                                : "gray",
                          }}
                        >
                          {applicant.status || "Pending"}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          disabled={applicant.status === "Accepted"}
                          onClick={() =>
                            handleDecision(applicant._id, "Accepted")
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          disabled={applicant.status === "Rejected"}
                          onClick={() =>
                            handleDecision(applicant._id, "Rejected")
                          }
                        >
                          Reject
                        </Button>
                      </TableCell>
                      <TableCell>
                        {/* Conditional color for the icon */}
                        {applicant.status === "Accepted" ? (
                          applicant.scheduledTime ? (
                            // If scheduled time is set, show green icon
                            <IconButton
                              onClick={() => handleOpenDialog(applicant._id)}
                              sx={{
                                color: "green",
                                "&:hover": { color: "darkgreen" },
                              }}
                            >
                              <AccessTime />
                            </IconButton>
                          ) : (
                            // Otherwise show the orange time icon
                            <IconButton
                              onClick={() => handleOpenDialog(applicant._id)}
                              sx={{
                                color: "orangered",
                                "&:hover": { color: "darkorange" },
                              }}
                            >
                              <AccessTime />
                            </IconButton>
                          )
                        ) : (
                          applicant.status === "Rejected" && (
                            <Typography sx={{ color: "gray" }}>
                              Schedule Time
                            </Typography>
                          )
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDelete(applicant._id)}>
                          <Cancel
                            sx={{
                              color: "gray",
                              transition: "color 0.3s",
                              "&:hover": { color: "red" },
                            }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No applicants found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* Dialog for scheduling interview */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Schedule Interview</DialogTitle>
        <DialogContent>
          <TextField
            label="Scheduled Time"
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: now, // prevent past dates
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleScheduleTime} color="primary">
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CollegeAdminApplicants;
