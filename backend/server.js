require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const applicationRoutes = require("./routes/applicationRoutes");


const app = express();
const PORT = process.env.PORT || 4000;

//midlleware
app.use(express.json());
app.use(cors());


app.use("/api/v1/user", userRoutes);
app.use("/api/v1/college", collegeRoutes);
app.use("/api/v1/job",authMiddleware , jobRoutes);
app.use("/api/v1/application", authMiddleware, applicationRoutes);


app.listen(PORT, () =>{
    connectDB();
     console.log(`Server running on port ${PORT}`)
});