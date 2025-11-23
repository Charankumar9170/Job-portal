import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate=useNavigate()
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
      });
    
      const [message, setMessage] = useState("");
    
      const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
    
        try {
          const response = await fetch("http://localhost:5003/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          });
    
          const result = await response.json();
    
          if (response.ok) {
            alert("registration completed");
            setForm({ name: "", email: "", password: "" });
          } else {
            setMessage(result.error || "Email already exists!");
          }
    
        } catch (error) {
          console.error("Error signing up:", error);
          setMessage("Something went wrong.");
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
          <button className="btn-outline" onClick={()=>navigate("/login")}>Login</button>
          <button className="btn-primary" onClick={()=>navigate("/employer-login")}>Post Job</button>
        </div>
      </header>
      </div>
      <div className="main-bg">
      <div className="login-container">
        <form className="login-box" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Sign Up</button>
          {message && <p style={{ color: "red" }}>{message}</p>}

          <p className="switch-text">
            Already have an account?{" "}
            <span onClick={()=> navigate("/login")}>Login</span>
          </p>
        </form>

        <div className="image-box">
          <img src="/image1.jpeg" height={100} width={100} alt="Signup Visual" />
        </div>

      </div>
      </div>
    </div>
  );
}

export default Signup;

