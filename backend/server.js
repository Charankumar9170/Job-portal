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

const PORT = 5002;
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
app.post("/api/auth/login", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
