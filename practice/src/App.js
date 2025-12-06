// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EmployerPage from "./EmployerPage";
import UserPage from "./UserPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/employer" />} />
        <Route path="/employer" element={<EmployerPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
