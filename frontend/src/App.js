import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Employerlogin from "./Employer_login";
import Employersignup from "./Employer_signup";
import "./App.css";
import HomePage from "./HomePage";
import UserHomePage from "./UserHomePage";
import EmployerHomePage from "./EmployerHomePage";

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
          <Route path="/user-home-page" element={<UserHomePage />} />
          <Route path="/home-page" element={<HomePage />} />
          <Route path="/employer-home-page" element={<EmployerHomePage />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
