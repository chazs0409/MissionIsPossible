import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./componentcss/signin.css";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Login failed");
      return;
    }

    // Save tokens
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("role", data.user.role);

    // Redirect based on role
    if (data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/search");
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-box" onSubmit={handleLogin}>
        <h2 className="signin-title">Sign In</h2>

        {error && <p className="signin-error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="signin-btn">
          Sign In
        </button>

        <p className="signin-footer">
          Don’t have an account? <a href="/register">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
