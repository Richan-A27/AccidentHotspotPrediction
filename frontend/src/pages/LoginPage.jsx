import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "../styles.css";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    // Validate form
    if (!form.username || !form.password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      console.log("📤 Sending login request:", { username: form.username, password: "***" });
      const res = await API.post("/auth/login", {
        username: form.username,
        password: form.password
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("username", res.data.username);

        if (res.data.role === "admin") navigate("/admin");
        else navigate("/user");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      // Show the actual error message from backend if available
      const errorMessage = err.response?.data?.message || err.message || "Invalid credentials. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-title">🚦 Road Risk Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="login-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="login-input"
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-button">
          Login
        </button>

        <p className="login-register">
          New here? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
