// src/MainLayout.js
import React, { useState,useEffect } from "react";
import "./ProfileDropdown.css";
import "./AdminPage.css";
import { useNavigate } from "react-router-dom";

//---------pages content--------------------------
function AllJobs() {
  const [jobCount, setJobCount] = useState(0);
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5003/fetch-jobs", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setJobCount(data.jobCount);
        setJobs(data.jobs);
      } else {
        console.error("Error:", data.message);
      }

    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      
      {/* Job Count */}
      <h2 style={{
        textAlign: "center",
        color: "#004aad",
        marginBottom: "20px"
      }}>
        Total Jobs Posted: {jobCount}
      </h2>

      {/* Section Title */}
      <h3 style={{
        color: "#222",
        marginBottom: "15px",
        fontWeight: "600"
      }}>
        Your Posted Jobs
      </h3>

      {/* No Jobs Case */}
      {jobs.length === 0 ? (
        <p style={{
          textAlign: "center",
          fontSize: "16px",
          color: "#777"
        }}>
          No jobs posted yet!
        </p>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {jobs.map((job, index) => (
            <div
              key={index}
              style={{
                width: "100%",
                border: "1px solid #ccc",
                padding: "18px",
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "0.2s ease-in-out",
                cursor: "pointer"
              }}
            >
              <h4
                style={{
                  color: "#004aad",
                  marginBottom: "10px",
                  fontSize: "20px"
                }}
              >
                {job.title}
              </h4>

              <p><strong>📍 Location:</strong> {job.location}</p>
              <p><strong>💰 Work Mode:</strong> {job.work_mode}</p>
              <p><strong>💰 Skills:</strong> {job.skills}</p>
              <p><strong>💰 Salary:</strong> {job.salary}</p>
              <p><strong>🎓 Qualification:</strong> {job.qualification}</p>

              <p
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  color: "#444"
                }}
              >
                <strong>📝 Description:</strong> {job.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function CreateJob() {
  //------------------ STATES ------------------
  const [form, setForm] = useState({
    id: "",
    title: "",
    location: "",
    work_mode:"",
    skills:"",
    salary: "",
    qualification: "",
    responsibilities: "",
    description: ""
  });

  const [message, setMessage] = useState("");

  //------------------ FETCH EMPLOYER ID ------------------
  const fetchEmployerId = async () => {
    try {
      const token = localStorage.getItem("token"); // token stored in login
    
      if (!token) {
        console.error("No token found!");
        return;
      }

      const response = await fetch("http://localhost:5003/api/auth/employer-profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Fetched Employer ID: ", data.id);
        setForm(prev => ({ ...prev, id: data.id })); // store id in form state
      } else {
        console.error(data.message || "Failed to fetch employer ID");
      }
    } catch (error) {
      console.error("Error fetching employer ID:", error);
    }
  };

  useEffect(() => {
    fetchEmployerId(); // Fetch employer ID when component loads
  }, []);

  //------------------ HANDLE INPUT CHANGE ------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //------------------ SUBMIT JOB FORM ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5003/post-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form) // includes employer ID now
      });

      const result = await response.json();

      if (response.ok) {
        alert("Job Created Successfully");

        // Reset form but keep id
        setForm(prev => ({
          ...prev,
          title: "",
          location: "",
          work_mode:"",
          skills:"",
          salary: "",
          qualification: "",
          responsibilities: "",
          description: ""
        }));
      } else {
        setMessage(result.error || "Failed to create Job!");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      setMessage("Something went wrong.");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
      <span className="section-tag">📝 New Opening </span>
      <h2 className="page-title">Create Job</h2>
      <p className="page-subtitle">
        Share the role details with candidates. Later this will be saved to your
        backend.
      </p>

      <div className="form-grid">
        <div className="form-group">
          <label>Job Title </label>
          <small>e.g. Frontend Developer, Backend Engineer</small>
          <input type="text"
            placeholder="Job title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required />
        </div>

        <div className="form-group">
          <label>Location</label>
          <small>e.g. Hyderabad, Bangalore, Pune</small>
          <input 
          type="text"
          placeholder="Job location"
          name="location"
          value={form.location}
          onChange={handleChange}
          required  />
        </div>
        <div className="form-group">
          <label>Work Mode</label>
          <small>e.g. Remote, Hybrid, WFO</small>
          <input 
          type="text"
          placeholder="Work Mode"
          name="work_mode"
          value={form.work_mode}
          onChange={handleChange}
          required  />
        </div>
        <div className="form-group">
          <label>Skills </label>
          <small>e.g. Java, Python, SQL</small>
          <input 
          type="text"
          placeholder="Skills"
          name="skills"
          value={form.skills}
          onChange={handleChange}
          required  />
        </div>

        <div className="form-group">
          <label>Salary (CTC)</label>
          <small>e.g. 6–10 LPA</small>
          <input 
          type="text"
          placeholder="Salary range" 
          name="salary"
          value={form.salary}
          onChange={handleChange}
          required />
        </div>

        <div className="form-group">
          <label>Qualification</label>
          <small>e.g. B.Tech CSE, MCA</small>
          <input 
          type="text"
          placeholder="Minimum qualification"
          name="qualification"
          value={form.qualification}
          onChange={handleChange}
          required  />
        </div>
      </div>

      <div className="form-group">
        <label>Responsibilities</label>
        <small>Short bullet-style responsibilities</small>
        <textarea
        placeholder="Describe key responsibilities..."
        name="responsibilities"
        value={form.responsibilities}
        onChange={handleChange}
        required  />
      </div>

      <div className="form-group">
        <label>Full Description</label>
        <small>
          Share details about role, team, tech stack, and expectations.
        </small>
        <textarea placeholder="Full job description..."
        name="description"
        value={form.description}
        onChange={handleChange}
        required  />
      </div>
      <button className="primary-btn" type="submit">Create Job</button>
      {message && <p style={{ color: "red",textAlign:"center" }}>{message}</p>}
      </form>
    </div>
  );
}
function DeleteJob() {
  return (
    <div>
      <h2 className="page-title">Delete Job</h2>
      <p className="page-subtitle">
        Delete a job posting by its ID. This will connect to your delete API later.
      </p>

      <div className="form-group">
        <label>Job ID</label>
        <input placeholder="Enter Job ID to delete" />
      </div>

      <button className="danger-btn">Delete Job</button>
    </div>
  );
}
function EditJob() {
  return (
    <div>
      <h2 className="page-title">Edit Job</h2>
      <p className="page-subtitle">
        Enter a job ID to fetch and update it when backend is ready.
      </p>

      <div className="form-group">
        <label>Job ID</label>
        <input placeholder="Enter Job ID" />
      </div>

      <button className="primary-btn">Fetch Job (demo)</button>

      <p className="info-text">
        Currently this is only a frontend. Later, this will call your API and
        load job details here.
      </p>
    </div>
  );
}





//------------------------compnents----------------------

function ProfileDropdown({ onClose }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token, redirect to login
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user profile
    fetch("http://localhost:5003/api/auth/employer-profile", {
      headers: {
        "Authorization": "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Invalid or expired token") {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setUser(data); // { id, name, email }
        }
      })
      .catch(() => {
        setError("Failed to load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  return (
    <div className="profile-panel" onMouseLeave={onClose}>
      <div className="profile-header">
        <div className="profile-photo">
          <span>👤</span>
        </div>
        <div className="profile-data">
          <h2>{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
        </div>
      </div>
      
      <div className="profile-details">
      <p><strong>Company:</strong> {user?.organisation}</p>
        <p><strong>Location:</strong> Pune, India</p>
        <p><strong>Jobs Posted:</strong> {user?.post_count}</p>
      </div>

      <button className="profile-btn view-btn">View Full Profile</button>
      <button className="profile-btn logout-btn"onClick={() => {
            localStorage.removeItem("token");
            navigate("/home-page");
          }} >Logout</button>
    </div>
  );
}
function NavTabs({ activePage, setActivePage }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "create", label: "Create Job" },
    { id: "edit", label: "Edit Job" },
    { id: "delete", label: "Delete Job" },
    { id: "jobs", label: "All Jobs" },
  ];

  return (
    <div className="nav-tabs-row">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab-pill ${
            activePage === tab.id ? "active" : ""
          }`}
          onClick={() => setActivePage(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function TopBar({ theme, toggleTheme, activePage, setActivePage }) {
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileToggle = () => {
    setShowProfile((prev) => !prev);
  };

  const closeProfile = () => {
    setShowProfile(false);
  };

  return (
    <header className="topbar">
      {/* Inner wrapper for layout */}
      <div className="topbar-inner">
        {/* LEFT: Title + subtitle + nav tabs */}
        <div className="topbar-left">
        <div className="logo">
          <span className="logo-highlight"> Job</span> Listing <span className="logo-highlight"> Portal</span>
          <span className="title">Admin Dashboard</span>
        </div>
          <NavTabs activePage={activePage} setActivePage={setActivePage} />
        </div>
        {/* RIGHT: theme toggle + profile */}
        <div className="topbar-right">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div className="profile-wrapper">
            <button className="profile-avatar" onClick={handleProfileToggle}>
            👤
            </button>

            {showProfile && (
              <ProfileDropdown onClose={closeProfile} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token, redirect to login
    if (!token) {
      navigate("/login");
      return;
    }
    // Fetch user profile
    fetch("http://localhost:5003/api/auth/employer-profile", {
      headers: {
        "Authorization": "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Invalid or expired token") {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setUser(data); // { id, name, email }
        }
      })
      .catch(() => {
        setError("Failed to load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  return (
    <div >
      <span className="section-tag">📊 Overview</span>
      <h2 className="page-title">Hiring Snapshot</h2>
      <p className="page-subtitle">
        Keep track of how your job postings are performing at a glance.
      </p>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-icon">📌</div>
          <div className="stat-label">Jobs Posted</div>
          <div className="stat-value">{user?.post_count}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📨</div>
          <div className="stat-label">Applications</div>
          <div className="stat-value">0</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🤝</div>
          <div className="stat-label">Interviews</div>
          <div className="stat-value">0</div>
        </div>
      </div>
    </div>
  );
}

function MainLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "create":
        return <CreateJob />;
      case "edit":
        return <EditJob />;
      case "delete":
        return <DeleteJob />;
      case "jobs":
        return <AllJobs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`app ${theme}`}>
      {/* Background image */}
      <div className="bg-layer" style={{ 
  backgroundImage: "url('/background.jpeg')" 
}} />

      {/* Top bar with title, nav tabs, theme & profile */}
      <TopBar
        theme={theme}
        toggleTheme={toggleTheme}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main content – 60% width on the left */}
      <main className="page-shell">
        <section className="page-card">{renderPage()}</section>
      </main>
    </div>
  );
}

export default MainLayout;
