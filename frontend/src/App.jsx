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
        <Route path="/college-admin-post-job" element={<CollegeAdminPostJob />} />
        <Route path="/college-admin-applicants" element={<CollegeAdminViewApplicants />} />
        <Route path="/student-dashboard" element={<StudentDashboard/>} />
        <Route path="/student-job-view" element={<StudentJobView/>} />
        <Route path="/college-admin-Students-applicants" element={<CollegeAdminApplicants/>}/>
      </Routes>
    </Router>
  );
};

export default App;
