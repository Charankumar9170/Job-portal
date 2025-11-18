import React, { useState } from "react";
import "./Login.css";

function Login({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Login Successful!\nEmail: ${email}`);
  };

  return (
    <div className="main-bg">
      <div className="login-container">

        <form className="login-box" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <p className="switch-text">
            Don’t have an account?{" "}
            <span onClick={onSwitch}>Sign up</span>
          </p>
        </form>

        <div className="image-box">
          <img src="/image1.jpeg" height={200} width={300} alt="Login Visual" />
        </div>

      </div>
    </div>
  );
}

export default Login;