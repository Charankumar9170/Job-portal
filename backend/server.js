import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();



app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});




app.use(express.json());

// ---------------------------
// DATABASE CONNECTION
// ---------------------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "job_portal",
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed:", err);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});

const PORT = 5003;
const JWT_SECRET = "very_secure_secret_key_123";

// ---------------------------
// REGISTER ROUTE
// ---------------------------
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Empty field check
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log("❌ DB Select Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err) {
            console.log("❌ Insert Error:", err);
            return res.status(500).json({ message: "Database error" });
          }

          return res.json({ message: "Registration successful" });
        }
      );
    }
  );
});

// ---------------------------
// LOGIN ROUTE
// ---------------------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log("❌ Login DB error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        message: "Login successful",
        token,
      });
    }
  );
});

// ---------------------------
// PROFILE ROUTE
// ---------------------------
app.get("/api/auth/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Invalid or expired token" });

    db.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [decoded.id],
      (err, results) => {
        if (err)
          return res.status(500).json({ message: "Database error" });

        if (results.length === 0)
          return res.status(404).json({ message: "User not found" });

        res.json(results[0]);
      }
    );
  });
});

//-----------------------------------------------------------------------------------
//EMPLOYER DATA
//-----------------------------------------------------------------------------------
app.post("/employer-register", (req, res) => {
  const {organisation, name, mobile_num, email, password } = req.body;
  const post_count = 0;

  // Empty field check
  if (!organisation || !name || !mobile_num || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "SELECT * FROM Employer WHERE email = ?  ",
    [email],
    async (err, results) => {
      if (err) {
        console.log("❌ DB Select Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Employer already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO Employer (organisation,name, mobile_num,email, password,post_count) VALUES (?, ?, ?, ?,?,?)",
        [organisation, name, mobile_num,email, hashedPassword,post_count],
        (err) => {
          if (err) {
            console.log("❌ Insert Error:", err);
            return res.status(500).json({ message: "Database error" });
          }

          return res.json({ message: "Registration successful" });
        }
      );
    }
  );
});

// ---------------------------
// LOGIN ROUTE
// ---------------------------
app.post("/employer-login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM Employer WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log("❌ Login DB error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Employer not found" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        message: "Login successful",
        token,
      });
    }
  );
});

// ---------------------------
// PROFILE ROUTE
// ---------------------------
app.get("/api/auth/employer-profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Invalid or expired token" });

    db.query(
      "SELECT id,organisation, name, email , post_count FROM Employer WHERE id = ?",
      [decoded.id],
      (err, results) => {
        if (err)
          return res.status(500).json({ message: "Database error" });

        if (results.length === 0)
          return res.status(404).json({ message: "Employer not found" });

        res.json(results[0]);
      }
    );
  });
});
//--------------------Jobs Data ---------------------------------------

//---------------- Job Posting ROUTE -----------------------------------
app.post("/post-job", (req, res) => {
  
  const { id, title, location,work_mode,skills, salary, qualification, responsibilities, description } = req.body;

  if (!id || !title || !location || !work_mode || !skills || !salary || !qualification || !responsibilities || !description) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const sql = `
    INSERT INTO Jobs 
    (employee_id, title, location,work_mode, skills, salary, qualification, responsibilities, description) 
    VALUES (?, ?, ?,? ,?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [id, title, location,work_mode,skills, salary, qualification, responsibilities, description],
    (err) => {
      if (err) {
        console.log("❌ Insert Error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      return res.json({ message: "Job created successfully" });
    }
  );
  
});
//------------------fetch jobs------------------
app.get("/fetch-jobs", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const employerId = decoded.id;

    const fetchJobsQuery = `
      SELECT Sno, employee_id, title, location, work_mode, skills, salary, qualification, responsibilities, description
      FROM Jobs 
      WHERE employee_id = ?
    `;

    db.query(fetchJobsQuery, [employerId], (err, jobs) => {
      if (err) {
        console.error("Job Fetch Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const countQuery = `
        SELECT COUNT(*) AS jobCount 
        FROM Jobs 
        WHERE employee_id = ?
      `;

      db.query(countQuery, [employerId], (err, countResult) => {
        if (err) {
          console.error("Count Fetch Error:", err);
          return res.status(500).json({ message: "Database error" });
        }

        const jobCount = countResult[0].jobCount;

        // 🔥 3️⃣ Update post_count in Employer table
        const updateQuery = `
          UPDATE Employer 
          SET post_count = ?
          WHERE id = ?
        `;

        db.query(updateQuery, [jobCount, employerId], (err) => {
          if (err) {
            console.error("Update Error:", err);
            return res.status(500).json({ message: "Update operation failed" });
          }

          // ✔ Now send the final response only after update success
          return res.json({
            message: "Job list fetched and count updated successfully",
            jobCount,
            jobs
          });
        });
      });
    });
  });
});

//-----------------------All the jobs in database,
app.get("/all-jobs", (req, res) => {
  
  const jobsQuery = "SELECT * FROM Jobs";
  const countQuery = "SELECT COUNT(*) AS jobCount FROM Jobs";

  db.query(jobsQuery, (err, jobs) => {
    if (err) {
      console.error("Job Fetch Error:", err);
      return res.status(500).json({ message: "Database error while fetching jobs" });
    }

    db.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Count Fetch Error:", err);
        return res.status(500).json({ message: "Database error while counting jobs" });
      }

      const jobCount = countResult[0].jobCount;

      return res.json({
        message: "All jobs fetched successfully",
        jobCount: jobCount,
        jobs: jobs
      });
    });
  });
});


//--------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


