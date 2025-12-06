import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./UserPage.css";

//--------------- helpers for description ----------------
const strip = (txt) => txt.replace(/<[^>]+>/g, "");
const isEnglish = (t) => /^[A-Za-z0-9\s.,!?'"()\-/:;]+$/.test(t);

async function translateToEnglish(text) {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=auto|en`
    );
    const data = await res.json();
    return data.responseData.translatedText || text;
  } catch {
    return text;
  }
}

//---------------- JOB LIST (uses DB jobs now) ----------------
function JobList({ jobs, loading, onApply }) {
  const [translated, setTranslated] = useState({});

  const translateDesc = async (job, index) => {
    const clean = strip(job.description || "");
    if (!isEnglish(clean)) {
      const en = await translateToEnglish(clean);
      setTranslated((prev) => ({ ...prev, [index]: en }));
    } else {
      setTranslated((prev) => ({ ...prev, [index]: clean }));
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!jobs.length) return <p className="loading">No jobs found</p>;

  return (
    <div className="job-list" id="job-list">
      {jobs.map((job, i) => {
        const desc = translated[i]
          ? translated[i]
          : strip(job.description || "").slice(0, 250) + "...";

        // skills from DB: assume comma-separated string
        const skillList = job.skills
          ? job.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [];

        return (
          <div
            className="job-card neu"
            key={job.Sno || i}
            onMouseEnter={() => translateDesc(job, i)}
          >
            <h2 className="job-title"> {job.company}</h2>
            
            {job.title && (
              <p className="qualification">
                <strong> Position: </strong>
                {job.title}
              </p>
            )}

            <div className="meta">
              <span className="meta-pill">
                📍 {job.location || "Unknown location"}
              </span>
              {job.salary && (
                <span className="meta-pill">💰 {job.salary}</span>
              )}
              {job.work_mode && (
                <span className="meta-pill">🕒 {job.work_mode}</span>
              )}
            </div>

            {job.qualification && (
              <p className="qualification">
                <strong>🎓 Qualification: </strong>
                {job.qualification}
              </p>
            )}

            <p className="desc">{desc}</p>

            {skillList.length > 0 && (
              <div className="skills">
                {skillList.map((skill) => (
                  <span className="skill" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <button className="apply-btn" onClick={() => onApply(job)}>
              Apply
            </button>
          </div>
        );
      })}
    </div>
  );
}

//----------------- user profile dropdown ------------------------------
function ProfileDropdown({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/home-page");
  };

  return (
    <div
      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50"
      onMouseLeave={onClose}
    >
      <button
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
        onClick={() => navigate("/user-home-page/p-profile")}
      >
        My Profile
      </button>
      <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
        Settings
      </button>
      <button
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

function Profilesec({ userName, email, theme, toggleTheme }) {
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#eef2f7",
      padding: "20px",
      marginTop: "10%",
      borderRadius: "20px",
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    card: {
      width: "420px",
      background: "#fff",
      padding: "28px",
      borderRadius: "18px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      animation: "fadeIn .3s ease",
    },
    title: {
      fontSize: "22px",
      fontWeight: 700,
      marginBottom: "18px",
      textAlign: "center",
    },
    fieldRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "14px",
      padding: "10px",
      background: "#f9fafb",
      borderRadius: "10px",
      border: "1px solid #e5e7eb",
    },
    fieldLabel: {
      width: "180px",
      fontSize: "17px",
      color: "#374151",
      fontWeight: 600,
    },
    fieldValue: {
      width: "300px",
      fontSize: "15px",
      color: "#111827",
      fontWeight: 500,
      marginRight: "20px",
    },
    btn: {
      marginTop: "20px",
      padding: "10px 16px",
      width: "100%",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
    },
  };

  return (
    <div
      className="profile-page "
      style={{
        backgroundImage: `url("/Users/charankurukuntla/job-portal/frontend/public/profile-bg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        border: "1px solid black",
        alignItems: "center",
      }}
    >
      <div className="topbar" id="top-bar">
        <div className="logo">
          <span className="logo-highlight"> Job</span> Listing{" "}
          <span className="logo-highlight"> Portal</span>
        </div>
        <nav>
          <ul className="nav-links">
            <li onClick={() => navigate("/user-home-page")}> Home</li>
            <li>Jobs</li>
            <li>About</li>
            <li>My Applications</li>
            <li>Contact</li>
          </ul>
        </nav>
        <div className="right">
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div className="profile">
            <button className="avatar" onClick={() => setMenu(!menu)}>
              {userName[0]}
            </button>
            {menu && (
              <div className="dropdown">
                <ProfileDropdown onClose={() => setMenu(false)} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>User Profile</div>
          <h1
            style={{
              border: "1px solid black",
              width: "100px",
              height: "100px",
              margin: "10%",
              marginLeft: "32%",
              paddingBottom: "15px",
              textAlign: "center",
              alignContent: "center",
              color: "white",
              backgroundColor: "black",
              fontSize: "60px",
              borderRadius: "100%",
            }}
          >
            {userName[0]}
          </h1>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Name :</span>
            <span style={styles.fieldValue}>{userName}</span>
          </div>

          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Email :</span>
            <span style={styles.fieldValue}>{email}</span>
          </div>

          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Location :</span>
            <span style={styles.fieldValue}>hyderabad</span>
          </div>

          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Jobs Applied :</span>
            <span style={styles.fieldValue}>5</span>
          </div>

          <button style={styles.btn}>Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

//------------------- user top bar ------------
function UserTopbar({ userName, theme, toggleTheme }) {
  const [menu, setMenu] = useState(false);

  return (
    <div className="topbar" id="top-bar">
      <div className="logo">
        <span className="logo-highlight"> Job</span> Listing{" "}
        <span className="logo-highlight"> Portal</span>
      </div>
      <nav>
        <ul className="nav-links">
          <li
            onClick={() =>
              document
                .getElementById("search")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Home
          </li>
          <li
            onClick={() =>
              document
                .getElementById("job-list")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Jobs
          </li>
          <li>About</li>
          <li>Applied Jobs</li>
          <li
            onClick={() =>
              document
                .getElementById("contact")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Contact
          </li>
        </ul>
      </nav>
      <div className="right">
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="profile">
          <button className="avatar" onClick={() => setMenu(!menu)}>
            {userName[0]}
          </button>

          {menu && (
            <div className="dropdown">
              <ProfileDropdown onClose={() => setMenu(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

//--------------- job filters -------------------
function JobFilters({ filters, setFilter, clearFilters }) {
  return (
    <div className="filter-box neu" id="search">
      <h2>Search Jobs</h2>

      <div className="filter-grid">
        {/* Keyword */}
        <input
          type="text"
          placeholder="Keywords"
          value={filters.keyword}
          onChange={(e) => setFilter("keyword", e.target.value)}
        />

        {/* Location */}
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilter("location", e.target.value)}
        />

        {/* Mode of work */}
        <select
          value={filters.mode}
          onChange={(e) => setFilter("mode", e.target.value)}
        >
          <option value="">All Modes</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="apply-btn">Apply Filters</button>
        <button className="clear-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}

//------------- MAIN USER PAGE (with auth) -------------
export default function UserPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // block browser back
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.go(1);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    mode: "",
  });

  // 🔐 AUTH STATE
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  // 🔐 Check token + fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5003/api/auth/profile", {
      headers: {
        Authorization: "Bearer " + token,
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
        setAuthError("Failed to load profile");
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, [navigate]);

  // 🧾 Jobs fetching from YOUR backend /all-jobs
  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5003/all-jobs", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setJobs(data.jobs || []);
        } else {
          console.error("Job fetch error:", data.message);
        }
      } catch (err) {
        console.error("Job fetch error:", err);
      }
      setLoading(false);
    }

    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const kw = filters.keyword.toLowerCase();
    const loc = filters.location.toLowerCase();
    const mode = filters.mode.toLowerCase();

    return jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const desc = job.description?.toLowerCase() || "";
      const qualification = job.qualification?.toLowerCase() || "";
      const jobLoc = job.location?.toLowerCase() || "";
      const jobMode = job.work_mode?.toLowerCase() || "";

      const keywordMatch =
        !kw ||
        title.includes(kw) ||
        desc.includes(kw) ||
        qualification.includes(kw);

      const locationMatch = !loc || jobLoc.includes(loc);

      const modeMatch = !mode || jobMode === mode;

      return keywordMatch && locationMatch && modeMatch;
    });
  }, [jobs, filters]);

  const setFilter = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const clearFilters = () =>
    setFilters({ keyword: "", location: "", mode: "" });

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  if (authLoading) return <h2>Loading...</h2>;
  if (authError) return <h3 style={{ color: "red" }}>{authError}</h3>;

  const userName = user?.name || "User";
  const email = user?.email || "Email";

  return (
    <div className={`app ${theme}`}>
      {/* Global background */}
      <div
        className="bg"
        style={{
          backgroundImage: `url("/profile-bg.jpg")`,
        }}
      />

      <Routes>
        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            <>
              <UserTopbar
                userName={userName}
                theme={theme}
                toggleTheme={toggleTheme}
              />

              <div className="filters-section">
                <JobFilters
                  filters={filters}
                  setFilter={setFilter}
                  clearFilters={clearFilters}
                />
              </div>

              <div className="job-section">
                <JobList
                  jobs={filteredJobs}
                  loading={loading}
                  onApply={(job) =>
                    setAppliedJobs((prev) => [...prev, job])
                  }
                />
              </div>

              <footer className="footer" id="contact">
                Contact us: support@jobportal.com{appliedJobs}
              </footer>
            </>
          }
        />

        {/* PROFILE PAGE */}
        <Route
          path="/p-profile"
          element={
            <>
              <UserTopbar
                userName={userName}
                theme={theme}
                toggleTheme={toggleTheme}
              />
              <Profilesec
                userName={userName}
                email={email}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            </>
          }
        />
      </Routes>
    </div>
  );
}
