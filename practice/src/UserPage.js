// pages/UserPage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmployerSummary from "./EmployerSummary";

const STORAGE_KEY = "jobsByEmployer";

function UserPage() {
  const [employers, setEmployers] = useState({});
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setEmployers(parsed);

      const flat = Object.entries(parsed).flatMap(
        ([employerName, data]) =>
          (data.jobs || []).map((job) => ({
            ...job,
            employerName,
          }))
      );
      setAllJobs(flat);
    }
  }, []);

  return (
    <div style={{ padding: "24px", fontFamily: "system-ui" }}>
      <h1>User – Jobs Feed</h1>
      <p>
        Employers page: <Link to="/employer">Post more jobs</Link>
      </p>

      {/* ✅ Summary moved into its own component */}
      <EmployerSummary employers={employers} />

      {/* All jobs list */}
      <div
        style={{
          marginTop: "24px",
          maxWidth: "700px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>All Jobs</h2>
        {!allJobs.length ? (
          <p>No jobs posted yet.</p>
        ) : (
          allJobs.map((job) => (
            <div
              key={job.id}
              style={{
                marginBottom: "12px",
                padding: "10px",
                borderRadius: "10px",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ margin: "0 0 4px" }}>{job.title}</h3>
              <p style={{ margin: "0 0 4px", fontWeight: 600 }}>
                {job.employerName}
              </p>
              <p style={{ margin: "0 0 4px", fontSize: "14px" }}>
                {job.location || "Location not specified"} • {job.type}
              </p>
              {job.description && (
                <p style={{ margin: "6px 0 0", fontSize: "14px" }}>
                  {job.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserPage;
