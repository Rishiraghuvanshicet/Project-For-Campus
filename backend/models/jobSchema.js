const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location:{ type: String, required: true},
  requirements: [{ type: String }],
  salary:{ type: Number, required: true},
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  createdAt: { type: Date, default: Date.now },
  applications: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
    }
]
});

module.exports = mongoose.model("Job", jobSchema);
