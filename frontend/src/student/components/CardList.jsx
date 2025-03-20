import React from "react";
import { Grid } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import JobCard from "./JobCard";

const CardList = ({ jobs, appliedJobs, applyForJob }) => {
  return (
    <Grid container spacing={3} justifyContent="center">
      <AnimatePresence mode="popLayout">
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job._id} component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <JobCard job={job} appliedJobs={appliedJobs} applyForJob={applyForJob} />
          </Grid>
        ))}
      </AnimatePresence>
    </Grid>
  );
};

export default CardList;
