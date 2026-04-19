import React, { useState } from "react";
import "./componentcss/register.css";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        last_name: lastName,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Account created!");
      setName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } else {
      alert(data.error);
    }
    navigate("/search");
    console.log(name, lastName, email, password);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2 className="register-title">Create Account</h2>

        <input
          type="text"
          placeholder="First Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="register-input"
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="register-input"
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
          required
        />

        <button type="submit" className="register-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
