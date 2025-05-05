const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  cvUrl: { type: String, required: true }, 
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  scheduledTime: { type: Date, default: null },
}, { timestamps: true });


module.exports = mongoose.model("Application", applicationSchema);

