import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import CollegeAdminHeader from "../components/CollegeAdminHeader";
import dayjs from "dayjs";

const COLORS = ["#FF5733", "#33A2FF"];

const CollegeAdminHomePage = () => {
  const [stats, setStats] = useState({ totalJobs: 0, totalStudents: 0 });
  const [jobTimeline, setJobTimeline] = useState([]);
  const [filter, setFilter] = useState("1month"); // Default to 1 month

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const jobResponse = await axios.get(
          "http://localhost:4000/api/v1/job/getTotalJobsByCollege",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const studentResponse = await axios.get(
          "http://localhost:4000/api/v1/college/getTotalStudentsByCollege",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const timelineResponse = await axios.get(
          "http://localhost:4000/api/v1/job/getJobPostingTimeline",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStats({
          totalJobs: jobResponse.data.totalJobs,
          totalStudents: studentResponse.data.totalStudents,
        });

        setJobTimeline(filterTimeline(timelineResponse.data.timeline, filter));
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, [filter]);

  const filterTimeline = (data, filterType) => {
    const today = dayjs();
    let startDate;

    if (filterType === "15days") {
      startDate = today.subtract(15, "day");
    } else if (filterType === "1month") {
      startDate = today.subtract(1, "month");
    } else if (filterType === "3months") {
      startDate = today.subtract(3, "month");
    }

    return data.filter((job) => dayjs(job.date).isAfter(startDate));
  };

  const chartData = [
    { name: "Jobs Posted", value: stats.totalJobs },
    { name: "Students Registered", value: stats.totalStudents },
  ];

  return (
    <>
      <CollegeAdminHeader />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
          mt: 4,
        }}
      >
        {/* Bar Chart */}
        <Card sx={{ width: 500, p: 3 }}>
          <CardContent>
            <Typography variant="h6" textAlign="center" mb={2}>
              College Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} barSize={40}>
                <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="orangered" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card sx={{ width: 500, p: 3 }}>
          <CardContent>
            <Typography variant="h6" textAlign="center" mb={2}>
              Jobs vs Students
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Dropdown for filtering timeline chart */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value="15days">Last 15 Days</MenuItem>
          <MenuItem value="1month">Last 1 Month</MenuItem>
          <MenuItem value="3months">Last 3 Months</MenuItem>
        </Select>
      </Box>

      {/* Line Chart for Job Posting Timeline */}
      <Card sx={{ maxWidth: 700, margin: "auto", mt: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h6" textAlign="center" mb={2}>
            Job Posting Timeline ({filter === "15days" ? "Last 15 Days" : filter === "1month" ? "Last 1 Month" : "Last 3 Months"})
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={jobTimeline}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(tick) => dayjs(tick).format("DD MMM")}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#FF5733" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default CollegeAdminHomePage;