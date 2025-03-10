import React from "react";
import { Card, CardContent, CardActions, Button, Typography } from "@mui/material";

const JobCard = ({ job, appliedJobs, applyForJob }) => {
  const isApplied = appliedJobs.some((app) => app.jobId === job._id || app.jobId?._id === job._id);

  return (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {job.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {job.description}
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
