import React from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate=useNavigate();
  return (
    <div className="hero-container">
      {/* Top Navigation */}
      <div className="Navigation">
      <header className="navbar">
        <div className="logo">
          <span className="logo-highlight"> Job</span> Listing <span className="logo-highlight"> Portal</span>
        </div>

        <nav>
          <ul className="nav-links">
            <li>Home</li>
            <li>Jobs</li>
            <li onClick={() => document.getElementById("about-section").scrollIntoView({ behavior: "smooth" })}>About</li>
            <li>Employers</li>
            <li onClick={() => document.getElementById("contact-section").scrollIntoView({ behavior: "smooth" })}>
  Contact
</li>
          </ul>
        </nav>

        <div className="nav-buttons">
          <button className="btn-outline" onClick={()=>navigate("/login")}>Login</button>
          <button className="btn-primary" onClick={()=>navigate("/employer-login")}>Post Job</button>
        </div>
      </header>
      </div>

      {/* Hero Search Section */}
      <div className="body">
      <div className="search-box-wrapper">
        <h1><i className="search-title">Your Dream  Job is waiting</i></h1>

        <div className="search-box">
          <select>
            <option>All Category</option>
            <option>SOFTWARE &IT</option>
            <option>BUSSINESS</option>
            <option>MANAGEMENT</option>

          </select>

          <select>
            <option>Select Location</option>
            <option>HYDERABAD</option>
            <option>LUCKNOW</option>
          </select>

          <input type="text" placeholder="Search By Keyword" />

          <button className="search-btn">🔍</button>
        </div>

        <button className="advanced-btn">
          ADVANCE JOB SEARCH ➕
        </button>
      </div>
      </div>
      <div  id ="about-section" className="about"> 
        <h1 className="about-heading">About :-</h1>
       <i>
        Our Job Listing Portal is a dynamic web application designed to connect job seekers with potential employers
        efficiently. It features a clean and intuitive interface where users can easily search for job openings across various
        industries. Employers can create detailed job listings, specifying qualifications, responsibilities, and company
        information. Job seekers can create profiles, upload resumes, and apply for jobs directly through the portal. The
        portal offers advanced search filters, including job type, location, and salary range, to help users find the perfect
        match. With real- time notifications, both employers and applicants stay updated on application statuses. Secure user
        authentication ensures data privacy and protection. The portal also includes a dashboard for users to manage their job
        postings and applications seamlessly.</i>
      </div>
      <footer id ="contact-section" className="footer-container">
      
      <div className="footer-content">
        <h2 className="footer-title">JobPortal</h2>

        <p>
          📍 <strong>Address:</strong> Your Company Street, City, State, PIN
        </p>

        <p>
          📞 <strong>Phone:</strong> +91 123 456 7890
        </p>

        <p>
          📧 <strong>Email:</strong> contact@jobportal.com
        </p>
      </div>

      <hr />

      <p className="copyright">
        © {new Date().getFullYear()} JobPortal — All Rights not Reserved.
      </p>
    </footer>
    </div>
  );
};

export default HomePage;
