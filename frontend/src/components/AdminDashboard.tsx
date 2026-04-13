import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./componentcss/admindashboard.css";
import logo from "../assets/square_one_logo.png";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"company" | "job">("company");

  const handleSignOut = () => {
    //clear token code (localStorage ect)
    navigate("/");
  };

  return (
    <div className="admin-wrapper">
      {/* ---------- TOP NAVBAR ---------- */}
      <div className="admin-navbar">
        <img
          src={logo}
          alt="Logo"
          className="admin-logo"
          onClick={() => navigate("/")}
        />

        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      {/* ---------- PAGE CONTENT ---------- */}
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "company" ? "active" : ""}`}
            onClick={() => setActiveTab("company")}
          >
            Add Company
          </button>

          <button
            className={`admin-tab ${activeTab === "job" ? "active" : ""}`}
            onClick={() => setActiveTab("job")}
          >
            Add Job
          </button>
        </div>

        {activeTab === "company" && (
          <div className="admin-card">
            <h2>Add New Company</h2>

            <form className="admin-form">
              <label>Company Name</label>
              <input type="text" placeholder="Google" />

              <label>Location</label>
              <input type="text" placeholder="New York, NY" />

              <label>Website</label>
              <input type="text" placeholder="https://company.com" />

              <label>Description</label>
              <textarea placeholder="Short description..." />

              <button className="admin-btn">Add Company</button>
            </form>
          </div>
        )}

        {activeTab === "job" && (
          <div className="admin-card">
            <h2>Add New Job</h2>

            <form className="admin-form">
              <label>Job Title</label>
              <input type="text" placeholder="Software Engineer" />

              <label>Company</label>
              <input type="text" placeholder="Google" />

              <label>Location</label>
              <input type="text" placeholder="San Francisco, CA" />

              <label>Visa Sponsorship</label>
              <select>
                <option>CPT</option>
                <option>OPT</option>
                <option>STEM OPT</option>
                <option>H-1B</option>
              </select>

              <label>Description</label>
              <textarea placeholder="Job responsibilities..." />

              <button className="admin-btn">Add Job</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
