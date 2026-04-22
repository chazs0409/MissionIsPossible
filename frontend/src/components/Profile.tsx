import { useEffect, useState } from "react";
import "./componentcss/profile.css";
import logo from "../assets/square_one_logo.png";
import { useNavigate } from "react-router";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  salary: string;
}

interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  saved_jobs: Job[];
  applied_jobs: Job[];
  resume: string | null;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch("http://localhost:8000/api/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error loading profile:", err));
  }, []);

  if (!user) return <p className="loading">Loading profile...</p>;
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("access");

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("http://localhost:8000/api/upload-resume/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
  };
  return (
    <div>
      <header>
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => navigate("/search")}
        />
        <button
          className="signout-btn"
          onClick={() => {
            localStorage.removeItem("access");
            window.location.href = "/signin";
          }}
        >
          Sign Out
        </button>
      </header>
      <div className="profile-container">
        <h2>My Profile</h2>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={activeTab === "info" ? "active" : ""}
            onClick={() => setActiveTab("info")}
          >
            Information
          </button>

          <button
            className={activeTab === "saved" ? "active" : ""}
            onClick={() => setActiveTab("saved")}
          >
            Saved Jobs
          </button>

          <button
            className={activeTab === "applied" ? "active" : ""}
            onClick={() => setActiveTab("applied")}
          >
            Applied
          </button>

          <button
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="profile-content">
          {activeTab === "info" && (
            <div className="info-section">
              <div className="photo-box">
                <div className="photo-placeholder">Photo</div>
                <button className="upload-btn">Upload Photo</button>
              </div>

              <div className="info-fields">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Last Name:</strong> {user.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>

                <div className="resume-box">
                  <p>
                    <strong>Resume:</strong>{" "}
                    {user.resume ? (
                      <a
                        href={`http://localhost:8000${user.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resume-link"
                      >
                        Download Resume
                      </a>
                    ) : (
                      "No resume uploaded"
                    )}
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    id="resumeUpload"
                    style={{ display: "none" }}
                    onChange={(e) => handleResumeUpload(e)}
                  />

                  <button
                    className="upload-btn"
                    onClick={() =>
                      document.getElementById("resumeUpload")?.click()
                    }
                  >
                    Upload Resume (PDF)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="saved-section">
              <h3>Saved Jobs</h3>

              {user.saved_jobs.length === 0 ? (
                <p>No saved jobs yet.</p>
              ) : (
                <ul className="saved-list">
                  {user.saved_jobs.map((job) => {
                    const alreadyApplied = user.applied_jobs.some((j) => j.id === job.id);
                    return (
                      <li key={job.id} className="saved-job-card">
                        <h4>{job.title}</h4>
                        <p>{job.company_name}</p>
                        <p>{job.location}</p>
                        <p>{job.salary}</p>
                        <button
                          className={`apply-btn ${alreadyApplied ? "applied" : ""}`}
                          disabled={alreadyApplied}
                          onClick={async () => {
                            const token = localStorage.getItem("access");
                            await fetch(`http://localhost:8000/api/apply-job/${job.id}/`, {
                              method: "POST",
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            setUser((prev) =>
                              prev ? { ...prev, applied_jobs: [...prev.applied_jobs, job] } : prev
                            );
                          }}
                        >
                          {alreadyApplied ? "Applied" : "Apply"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
          {activeTab === "applied" && (
            <div className="saved-section">
              <h3>Applied Jobs</h3>
              {user.applied_jobs.length === 0 ? (
                <p>No applied jobs yet. Click "Apply" on a saved job to track it here.</p>
              ) : (
                <ul className="saved-list">
                  {user.applied_jobs.map((job) => (
                    <li key={job.id} className="saved-job-card">
                      <h4>{job.title}</h4>
                      <p>{job.company_name}</p>
                      <p>{job.location}</p>
                      <p>{job.salary}</p>
                      <span className="applied-badge">Applied</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "analytics" && (() => {
            const locationCounts: Record<string, number> = {};
            user.saved_jobs.forEach((job) => {
              const loc = job.location || "Unknown";
              locationCounts[loc] = (locationCounts[loc] || 0) + 1;
            });
            const chartData = Object.entries(locationCounts).map(([name, value]) => ({ name, value }));
            const COLORS = ["#0f4a2a", "#1a6b3c", "#2d9e5f", "#3ab26e", "#57c98a", "#74d99f"];

            return (
              <div className="analytics-section">
                <h3>My Applications</h3>
                <p className="saved-count">{user.saved_jobs.length} jobs saved</p>
                {user.saved_jobs.length === 0 ? (
                  <p>No saved jobs to analyze yet.</p>
                ) : (
                  <div className="chart-wrapper">
                    <h4>Jobs by Location</h4>
                    <ResponsiveContainer width="100%" height={420}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${Math.round(percent * 100)}%)`}
                          labelLine={true}
                        >
                          {chartData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number, name: string) => [`Count: ${value} job${value > 1 ? "s" : ""}`, name]} />
                        <Legend wrapperStyle={{ color: "#111827", fontSize: "0.85rem" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>{" "}
    </div>
  );
};

export default ProfilePage;
