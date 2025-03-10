// CardList.js
import React from "react";
import { Grid } from "@mui/material";
import JobCard from "./JobCard";

const CardList = ({ jobs, appliedJobs, applyForJob }) => {
  return (
    <Grid container spacing={3} justifyContent="center">
      {jobs.map((job) => (
        <Grid item xs={12} sm={6} md={4} key={job._id}>
          <JobCard job={job} appliedJobs={appliedJobs} applyForJob={applyForJob} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CardList;
