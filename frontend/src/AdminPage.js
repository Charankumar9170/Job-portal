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
        color: "#444",
        marginBottom: "15px",
        fontWeight: "600",
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
                {job.company}
              </h4>
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  color: "#444"
                }}
              >
                <strong>Poition:</strong> {job.title}
              </p>
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  color: "#444"
                }}
              >
                <strong>Job ID:</strong> {job.job_id}
              </p>
              <p style={{color: "#444"}}><strong>📍 Location:</strong> {job.location}</p>
              <p style={{color: "#444"}}><strong>Work Mode:</strong> {job.work_mode}</p>
              <p style={{color: "#444"}}><strong>Skills:</strong> {job.skills}</p>
              <p style={{color: "#444"}}><strong>💰 Salary:</strong> {job.salary}</p>
              <p style={{color: "#444"}}><strong>🎓 Qualification:</strong> {job.qualification}</p>

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
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  color: "#444"
                }}
              >
                <strong>Posted On:</strong> {job.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

//--------------------CREATE JOB--------------------------

function CreateJob() {
  const [form, setForm] = useState({
    id: "",
    title: "",
    location: "",
    work_mode: "",
    skills: "",
    salary: "",
    qualification: "",
    responsibilities: "",
    description: "",
    job_id: ""
  });

  const [message, setMessage] = useState("");

  // ---------- helper to get today's date in dd-mm-yyyy ----------
  const getCurrentDateFormatted = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 0-based
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  };

  //------------------ FETCH EMPLOYER ID ------------------
  const fetchEmployerId = async () => {
    try {
      const token = localStorage.getItem("token"); // token stored in login

      if (!token) {
        console.error("No token found!");
        return;
      }

      const response = await fetch(
        "http://localhost:5003/api/auth/employer-profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Fetched Employer ID: ", data.id);
        setForm((prev) => ({ ...prev, id: data.id }));
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // ---- add current date as timestamp in dd-mm-yyyy ----
    const currentDate = getCurrentDateFormatted();

    try {
      const response = await fetch("http://localhost:5003/post-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // send date along with the job details
        body: JSON.stringify({
          ...form,
          posted_date: currentDate // this is the field your backend will receive
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Job Created Successfully");

        // Reset form but keep id
        setForm((prev) => ({
          ...prev,
          title: "",
          location: "",
          work_mode: "",
          skills: "",
          salary: "",
          qualification: "",
          responsibilities: "",
          description: "",
          job_id: ""
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
          Share the role details with candidates. Later this will be saved to
          your backend.
        </p>

        <div className="form-grid">
          <div className="form-group">
            <label>Job Title </label>
            <small>e.g. Frontend Developer, Backend Engineer</small>
            <input
              type="text"
              placeholder="Job title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
            required
          />
        </div>

        <div className="form-group">
          <label>Full Description</label>
          <small>
            Share details about role, team, tech stack, and expectations.
          </small>
          <textarea
            placeholder="Full job description..."
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Create Job Id</label>
          <input
            type="text"
            placeholder="Job_Id"
            name="job_id"
            value={form.job_id}
            onChange={handleChange}
            required
          />
        </div>

        <button className="primary-btn" type="submit">
          Create Job
        </button>
        {message && (
          <p style={{ color: "red", textAlign: "center" }}>{message}</p>
        )}
      </form>
    </div>
  );
}

//---------------------_DELETE JOB-----------------------------
function DeleteJob() {
  const [job_id, setJobId] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!job_id.trim()) {
      setMessage("Please enter a Job ID!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5003/employee/delete-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ job_id })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✔ Job deleted successfully!");
        setJobId(""); // Reset input field
      } else {
        setMessage(data.message || "Failed to delete job!");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      setMessage("Something went wrong!");
    }
  };

  return (
    <div>
      <h2 className="page-title">Delete Job</h2>
      <p className="page-subtitle">
        Delete a job posting by its ID. This will connect to your delete API later.
      </p>
      <form onSubmit={handleDelete}>
      <div className="form-group">
        <label>Job ID</label>
        <input 
        type="text"
        placeholder="Enter Job ID to delete"
        value={job_id}
        onChange={(e) => setJobId(e.target.value)}
          required
        />
      </div>
      <button className="danger-btn">Delete Job</button>
      </form>
      {message && (
        <p style={{ marginTop: "15px", textAlign: "center", color: "blue" }}>
          {message}
        </p>
      )}
    </div>
  );
}
//---------------------_--EDIT JOB-----------------
function EditJob() {
  const [searchJobId, setSearchJobId] = useState("");
  const [job, setJob] = useState(null);            // fetched job
  const [editData, setEditData] = useState({       // editable fields
    title: "",
    location: "",
    work_mode: "",
    skills: "",
    salary: "",
    qualification: "",
    responsibilities: "",
    description: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // -------------------- HANDLE SEARCH --------------------
  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setJob(null);

    const trimmedId = searchJobId.trim();
    if (!trimmedId) {
      setMessage("Please enter a Job ID to search.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setMessage("No token found. Please login again.");
        return;
      }

      const res = await fetch("http://localhost:5003/fetch-jobs", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setMessage(data.message || "Failed to fetch jobs.");
        return;
      }

      // data.jobs is the array returned from your /fetch-jobs API
      const jobs = data.jobs || [];

      const foundJob = jobs.find((j) => String(j.job_id) === trimmedId);

      if (!foundJob) {
        setLoading(false);
        setMessage(`No job found with Job ID: ${trimmedId}`);
        return;
      }

      // Set job and pre-fill edit form
      setJob(foundJob);
      setEditData({
        title: foundJob.title || "",
        location: foundJob.location || "",
        work_mode: foundJob.work_mode || "",
        skills: foundJob.skills || "",
        salary: foundJob.salary || "",
        qualification: foundJob.qualification || "",
        responsibilities: foundJob.responsibilities || "",
        description: foundJob.description || ""
      });

      setLoading(false);
      setMessage("");
    } catch (err) {
      console.error("Error fetching job:", err);
      setLoading(false);
      setMessage("Something went wrong while fetching jobs.");
    }
  };

  // -------------------- HANDLE EDIT INPUT CHANGE --------------------
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // -------------------- HANDLE UPDATE SUBMIT --------------------
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!job) {
      setMessage("No job selected to update.");
      return;
    }

    setMessage("");

    const payload = {
      job_id: job.job_id, // important for backend to know which job
      title: editData.title,
      location: editData.location,
      work_mode: editData.work_mode,
      skills: editData.skills,
      salary: editData.salary,
      qualification: editData.qualification,
      responsibilities: editData.responsibilities,
      description: editData.description
    };

    try {
      const res = await fetch("http://localhost:5003/employer/job-update", {
        method: "POST", // use PUT if your backend expects PUT
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to update job.");
        return;
      }

      setMessage("Job updated successfully ✅");
    } catch (err) {
      console.error("Error updating job:", err);
      setMessage("Something went wrong while updating the job.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
      <h2>Search & Edit Job</h2>
      {message && (
        <p style={{ textAlign: "center", color: "crimson", marginBottom: 20 }}>
          {message}
        </p>)}
      {/* Search Section */}
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <input
          type="text"
          placeholder="Enter Job ID"
          value={searchJobId}
          onChange={(e) => setSearchJobId(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 18px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#2563eb",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Job Details + Edit Form */}
      {job && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}
        >
          <h3>
            Editing Job: <span style={{ color: "#4b5563" }}>{job.job_id}</span>
          </h3>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>
            Posted on: {job.date ? job.date : "N/A"}
          </p>

          <form onSubmit={handleUpdate}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px"
              }}
            >
              <div>
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "4px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db"
                  }}
                />
              </div>

              <div>
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={editData.location}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "4px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db"
                  }}
                />
              </div>

              <div>
                <label>Work Mode</label>
                <input
                  type="text"
                  name="work_mode"
                  value={editData.work_mode}
                  onChange={handleEditChange}
                  required
                  placeholder="Remote / Hybrid / WFO"
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "4px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db"
                  }}
                />
              </div>

              <div>
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={editData.skills}
                  onChange={handleEditChange}
                  required
                  placeholder="e.g. React, Node, SQL"
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "4px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db"
                  }}
                />
              </div>

              <div>
                <label>Salary (CTC)</label>
                <input
                  type="text"
                  name="salary"
                  value={editData.salary}
                  onChange={handleEditChange}
                  required
                  placeholder="e.g. 6-10 LPA"
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "4px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db"
                  }}
                />
              </div>

              <div>
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={editData.qualification}
                  onChange={handleEditChange}
                  required
                  placeholder="e.g. B.Tech, MCA"
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "4px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db"
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label>Responsibilities</label>
              <textarea
                name="responsibilities"
                value={editData.responsibilities}
                onChange={handleEditChange}
                required
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "4px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <label>Description</label>
              <textarea
                name="description"
                value={editData.description}
                onChange={handleEditChange}
                required
                rows={4}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "4px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  resize: "vertical"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#16a34a",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Save Changes
            </button>
          </form>
          {message && (
        <p style={{ textAlign: "center", color: "crimson", marginBottom: 20 }}>
          {message}
        </p>
      )}
        </div>
      )}
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
