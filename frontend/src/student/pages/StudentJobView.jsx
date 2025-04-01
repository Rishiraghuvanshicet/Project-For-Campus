import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import StudentHeader from "../components/StudentHeader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudentJobView = () => {
  const [collegeJobs, setCollegeJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const collegeJobsResponse = await axios.get(
          "http://localhost:4000/api/v1/job/college", 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCollegeJobs(collegeJobsResponse.data);

        const appliedJobsResponse = await axios.get(
          "http://localhost:4000/api/v1/application/getAppliedJobs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppliedJobs(appliedJobsResponse.data);

        setError(null);
      } catch (err) {
        setError("Error fetching job data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare data for the bar chart
  const chartData = {
    labels: ["Available Jobs", "Applied Jobs"],
    datasets: [
      {
        label: "Jobs Count",
        data: [collegeJobs.length, appliedJobs.length],
        backgroundColor: ["#FF4500", "#66BB6A"],
        borderColor: ["#1E88E5", "#43A047"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Job Statistics", 
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <StudentHeader />
      <Container sx={{ marginTop: "60px", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Job Statistics
        </Typography>
        {loading && <CircularProgress />}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading &&
          !error &&
          collegeJobs.length > 0 &&
          appliedJobs.length > 0 && (
            <Grid container justifyContent="center" sx={{ mt: 4 }}>
              <Bar data={chartData} options={chartOptions} />
            </Grid>
          )}
      </Container>
    </>
  );
};

export default StudentJobView;
