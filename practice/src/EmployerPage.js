// pages/EmployerPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "jobsByEmployer";

function EmployerPage() {
  const [employers, setEmployers] = useState({});
  const [currentEmployer, setCurrentEmployer] = useState("");

  const [form, setForm] = useState({
    title: "",
    location: "",
    type: "Full-time",
    description: "",
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setEmployers(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever employers change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employers));
  }, [employers]);

  const handleEmployerChange = (e) => {
    setCurrentEmployer(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentEmployer.trim()) {
      alert("Please enter employer name / id");
      return;
    }
    if (!form.title.trim()) {
      alert("Job title is required");
      return;
    }

    const newJob = {
      id: Date.now(),
      title: form.title,
      location: form.location,
      type: form.type,
      description: form.description,
      createdAt: new Date().toISOString(),
    };

    setEmployers((prev) => {
      const copy = { ...prev };
      if (!copy[currentEmployer]) {
        copy[currentEmployer] = { jobs: [] };
      }
      copy[currentEmployer].jobs = [...copy[currentEmployer].jobs, newJob];
      return copy;
    });

    setForm({
      title: "",
      location: "",
      type: "Full-time",
      description: "",
    });
  };

  const jobsForCurrent =
    currentEmployer && employers[currentEmployer]
      ? employers[currentEmployer].jobs
      : [];

  return (
    <div style={{ padding: "24px", fontFamily: "system-ui" }}>
      <h1>Employer – Post Jobs</h1>
      <p>
        View all jobs as a user here: <Link to="/user">User Page</Link>
      </p>

      {/* Employer selector/input */}
      <div
        style={{
          marginTop: "16px",
          marginBottom: "12px",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          maxWidth: "400px",
        }}
      >
        <label style={{ fontWeight: 600 }}>Employer Name / ID</label>
        <input
          type="text"
          value={currentEmployer}
          onChange={handleEmployerChange}
          placeholder="e.g. TCS, Infosys, Employer-101"
          style={{
            width: "100%",
            padding: "6px",
            marginTop: "6px",
          }}
        />
        {currentEmployer && (
          <p style={{ marginTop: "6px", fontSize: "14px" }}>
            Jobs posted by <strong>{currentEmployer}</strong>:{" "}
            <strong>{jobsForCurrent.length}</strong>
          </p>
        )}
      </div>

      {/* Job form */}
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "450px",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="React Developer"
            style={{ width: "100%", padding: "6px", marginTop: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Hyderabad / Remote"
            style={{ width: "100%", padding: "6px", marginTop: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Job Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={{ width: "100%", padding: "6px", marginTop: "4px" }}
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Short description about the job"
            style={{ width: "100%", padding: "6px", marginTop: "4px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#2563eb",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Post Job
        </button>
      </form>

      {/* List of jobs only for this employer */}
      {currentEmployer && (
        <div style={{ marginTop: "24px", maxWidth: "600px" }}>
          <h2>
            Jobs posted by{" "}
            <span style={{ color: "#2563eb" }}>{currentEmployer}</span>
          </h2>
          {!jobsForCurrent.length ? (
            <p>No jobs yet.</p>
          ) : (
            jobsForCurrent.map((job) => (
              <div
                key={job.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "10px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <strong>{job.title}</strong> – {job.location || "N/A"} (
                {job.type})
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default EmployerPage;
