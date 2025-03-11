import React from "react";
import { Card, CardContent, CardActions, Button, Typography } from "@mui/material";

const JobCard = ({ job, appliedJobs, applyForJob }) => {
  const isApplied = appliedJobs.includes(job._id); // Check if job is already applied

  return (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {job.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {job.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Location:</strong> {job.location}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Salary:</strong> {job.salary ? `₹${job.salary}` : "Not Disclosed"}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          color={isApplied ? "success" : "primary"}
          disabled={isApplied}
          onClick={() => applyForJob(job._id)}
        >
          {isApplied ? "Applied" : "Apply"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobCard;
