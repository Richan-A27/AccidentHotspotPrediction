import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "../styles.css";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Password validation: at least 8 chars, A-Z, a-z, 0-9, special char
  const passwordValid = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$])[A-Za-z\d!@#$]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!passwordValid(form.password)) {
      setError(
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special symbol (!@#$)"
      );
      return;
    }

    try {
      console.log("📤 Sending register request");
      const res = await API.post("/auth/register", {
        username: form.username,
        password: form.password,
        role: "user",
      });

      if (res.data.message) {
        alert("🎉 Registration successful! You can now log in.");
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Register error:", err);
      // Show the actual error message from backend if available
      const errorMessage = err.response?.data?.message || err.message || "Registration failed. Try another username.";
      setError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleRegister} className="login-form">
        <h2 className="login-title">🚦 Create Your Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Enter username"
          onChange={handleChange}
          required
          className="login-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Create password"
          onChange={handleChange}
          required
          className="login-input"
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-button">
          Register
        </button>

        <p className="login-register">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
