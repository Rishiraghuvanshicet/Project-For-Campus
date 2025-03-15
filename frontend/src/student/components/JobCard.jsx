import React from "react";
import { Card, CardContent, CardActions, Button, Typography } from "@mui/material";

const JobCard = ({ job, appliedJobs, applyForJob }) => {
  const isApplied = appliedJobs.includes(job._id); // Always check from backend data

  const handleApply = () => {
    if (!isApplied) {
      applyForJob(job._id);
    }
  };

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: "16px",
        boxShadow: 3,
        backgroundColor: "white",
        color: "black",
        textAlign: "center",
        maxWidth: "300px",
        m: 2,
      }}
    >
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
          disabled={isApplied}
          onClick={handleApply}
          sx={{
            borderRadius: "50%", // Circular button
            width: "70px",
            height: "70px",
            fontWeight: "bold",
            fontSize: "14px",
            color: "white",
            background: isApplied ? "green" : "orangered", // Default Orange
            transition: "background 0.4s ease-in-out, box-shadow 0.6s ease-in-out",
            boxShadow: isApplied
              ? "0px 0px 10px rgba(0, 255, 0, 0.8)" // Green glow when applied
              : "none",
            "&:hover": {
              background: isApplied ? "green" : "limegreen", // Hover turns Green
              boxShadow: "0px 0px 12px rgba(50, 205, 50, 0.6)", // Soft green glow
            },
          }}
        >
          {isApplied ? "✔ Applied" : "Apply"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobCard;
