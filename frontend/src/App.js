import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Employerlogin from "./Employer_login";
import Employersignup from "./Employer_signup";
import "./App.css";
import HomePage from "./HomePage";
import MainLayout from "./AdminPage";
import UserPage from "./UserPage";
import JobList from "./JobList";
function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/employer-signup" element={<Employersignup />} />
          <Route path="/employer-login" element={<Employerlogin/>} />
          <Route path="/user-home-page/*" element={<UserPage />} />
          <Route path="/home-page" element={<HomePage />} />
          <Route path="/admin-homepage" element={<MainLayout />} />
          <Route path ="/joblist" element={<JobList/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
