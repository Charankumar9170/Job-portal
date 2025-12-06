// components/EmployerSummary.js
import React from "react";

function EmployerSummary({ employers }) {
  const employerEntries = Object.entries(employers || {});

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        maxWidth: "500px",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Employers Summary</h2>
      {employerEntries.length === 0 ? (
        <p>No employers or jobs yet.</p>
      ) : (
        <ul style={{ paddingLeft: "16px" }}>
          {employerEntries.map(([name, data]) => (
            <li key={name}>
              <strong>{name}</strong> – {data.jobs?.length || 0} job(s)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EmployerSummary;
