import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:4000/api/v1/job/college/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setJob(res.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJob();
  }, [jobId]);

  if (!job) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button
        variant="contained"
        startIcon={<ArrowBack />}
        sx={{ mb: 2, backgroundColor: "orangered" }}
        onClick={() => window.history.back()}
      >
        Back
      </Button>

      <Card sx={{ boxShadow: 6, borderRadius: 4, bgcolor: "#f5f5f5" }}>
        <CardContent sx={{ padding: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", mb: 3, color: "orangered" }}
            align="center"
          >
            {job.title}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 1, color: "orangered" }}
                >
                  Requirements
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 16 }}>
                  {job.requirements.join(", ")}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 1, color: "orangered" }}
                >
                  Salary
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 16 }}>
                  {job.salary || "Not Disclosed"}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 1, color: "orangered" }}
                >
                  Location
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 16 }}>
                  {job.location}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 1, color: "orangered" }}
                >
                  Posted On
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 16 }}>
                  {new Date(job.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              {/* Description Section */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 1, color: "orangered" }}
                >
                  Description
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 16 }}>
                  {job.description}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default JobDetails;
