import React, { useEffect, useState } from "react";

// --- simple JS styles (CSS-in-JS) ---
const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    background: "#f4f5fb",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1f2933",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },
  // ⬇️ CHANGE: vertical list (not grid)
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(15,23,42,0.08)",
    border: "1px solid #e5e7eb",
    transition: "transform .15s ease, box-shadow .15s ease",
  },
  jobTitle: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "6px",
    color: "#111827",
  },
  company: {
    fontSize: "14px",
    color: "#4b5563",
    marginBottom: "10px",
  },
  location: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "10px",
  },
  desc: {
    fontSize: "13px",
    color: "#4b5563",
    lineHeight: 1.5,
    marginBottom: "12px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: "12px",
    color: "#9ca3af",
  },
  button: {
    background: "#2563eb",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "999px",
    border: "none",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

// Helpers
const stripHtml = (html) =>
  html?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "";

const formatDate = (unixSeconds) => {
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("https://www.arbeitnow.com/api/job-board-api");
        const json = await res.json();
        setJobs(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) return <p style={styles.subtitle}>Loading jobs...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <p style={styles.subtitle}>{jobs.length} jobs found</p>
      </div>

      <div style={styles.list}>
        {jobs.map((job) => {
          const shortDesc = stripHtml(job.description).slice(0, 180) + "...";
          return (
            <div
              key={job.slug}
              style={styles.card}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "none")
              }
            >
              <div style={styles.jobTitle}>{job.title}</div>
              <div style={styles.company}>{job.company_name}</div>

              <div style={styles.location}>
                📍 {job.location || "Location not specified"}
              </div>

              <p style={styles.desc}>{shortDesc}</p>

              <div style={styles.footer}>
                <span style={styles.date}>
                  {formatDate(job.created_at)}
                </span>
                <a href={job.url} target="_blank" rel="noreferrer">
                  <button style={styles.button}>View Job</button>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
