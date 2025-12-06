import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5003/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // Save JWT token in localStorage
        localStorage.setItem("token", data.token);

        alert("Login successful!");

        // Redirect to dashboard or profile page
        navigate("/user-home-page");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong. Try again.");
    }
  };
  return (
    <div >
       <div className="Navigation">
       <header className="navbar">
        <div className="logo">
          <span className="logo-highlight"> Job</span> Listing <span className="logo-highlight"> Portal</span>
        </div>

        <nav>
          <ul className="nav-links">
          <li><a href="/">Home</a></li>
            <li>Jobs</li>
            <li onClick={() => document.getElementById("about-section").scrollIntoView({ behavior: "smooth" })}>About</li>
            <li>Employers</li>
            <li onClick={() => document.getElementById("contact-section").scrollIntoView({ behavior: "smooth" })}>Contact
            </li>
          </ul>
        </nav>

        <div className="nav-buttons">
          <button className="btn-outline" onClick={()=>navigate("/signup")}>User SignUp</button>
          <button className="btn-primary" onClick={()=>navigate("/employer-login")}>Employer Login</button>
        </div>
      </header>
      </div>
     <div className="main-bg">
     <div className="login-container">
        <form className="login-box" onSubmit={handleSubmit}>
          <h2>User Login</h2>

          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
          {message && <p style={{ color: "red" }}>{message}</p>}
          <p className="switch-text">
            Don’t have an account?{" "}
            <span onClick={()=>navigate("/signup")}>Sign up</span>
          </p>
        </form>
        <div className="image-box">
          <img src="/image1.jpeg" height={200} width={300} alt="Login Visual" />
        </div>

      </div>
     </div>
    </div>
  );
}

export default Login;