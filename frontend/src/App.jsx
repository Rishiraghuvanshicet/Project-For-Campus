import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
// import PrivateRoute from "./PrivateRoute"
// import RegisterAdmin from "./mainAdmin/RegisterAdmin";
// import LoginAdmin from "./mainAdmin/LoginAdmin";
// import MainAdminDashboard from "./mainAdmin/MainAdminDashboard";
// import RegisterCollege from "./mainAdmin/RegisterCollege"
import Login from "./Login";
import Register from "./Register";
import CollegeAdminHomePage from "./collegeAdmin/pages/CollegeAdminHomePage";
import CollegeAdminDashBoard from "./collegeAdmin/pages/CollegeAdminDashBoard";
import CollegeAdminPostJob from "./collegeAdmin/pages/CollegeAdminJobPost";
import CollegeAdminViewApplicants from "./collegeAdmin/pages/CollegeAdminViewApplicants";
import StudentDashboard from "./student/pages/StudentDashboard";
import StudentJobView from "./student/pages/StudentJobView";
import CollegeAdminApplicants from "./collegeAdmin/pages/CollegeAdminApplicants";
import StudentAppliedJobs from "./student/pages/StudentAppliedJobs";
import StudentEditProfile from "./student/pages/StudentEditProfile";
import CollegeAdminEditProfile from "./collegeAdmin/pages/CollegeAdminEditProfile";
import JobDetails from "./student/pages/JobDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/main-admin/login" />} />
        <Route path="/register" element={<RegisterAdmin />} />
        <Route path="/main-admin/login" element={<LoginAdmin />} />
        <Route element={<PrivateRoute />}>
          <Route path="/main-admin/dashboard" element={<MainAdminDashboard />} />
        </Route>
        <Route path="/main-admin/register-college" element={<RegisterCollege/>}/> */}
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/college-admin-home-page" element={<CollegeAdminHomePage/>}/>
        <Route path="/college-admin-dashboard" element={<CollegeAdminDashBoard />} />
        <Route path="/college-admin-dashboard/college-admin-edit-profile" element={<CollegeAdminEditProfile/>}/>
        <Route path="/college-admin-post-job" element={<CollegeAdminPostJob />} />
        <Route path="/college-admin-applicants" element={<CollegeAdminViewApplicants />} />
        <Route path="/college-admin-Students-applicants" element={<CollegeAdminApplicants/>}/>
        <Route path="/student-dashboard" element={<StudentDashboard/>} />
        <Route path="/student-dashboard/Job-View/:jobId" element={<JobDetails/>}/>
        <Route path="/student-dashboard/applied-jobs" element={<StudentAppliedJobs/>}/>
        <Route path="/student-dashboard/JobView" element={<StudentJobView/>}/>
        <Route path="/student-dashboard/editprofile" element={<StudentEditProfile/>}/>
      </Routes>
    </Router>
  );
};

export default App;
