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

interface Application {
  id: number;
  job: Job;
  status: "applied" | "interviewing" | "offer" | "rejected";
  created_at: string;
}

interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  saved_jobs: Job[];
  applications: Application[];
  resume: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<string, string> = {
  applied: "#2d9e5f",
  interviewing: "#f59e0b",
  offer: "#1a6b3c",
  rejected: "#ef4444",
};

const TOKEN = () => localStorage.getItem("access");

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/profile/", {
      headers: { Authorization: `Bearer ${TOKEN()}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error loading profile:", err));
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    const res = await fetch("http://localhost:8000/api/upload-resume/", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN()}` },
      body: formData,
    });
    const data = await res.json();
    alert(data.message);
  };

  const handleUnsave = async (jobId: number) => {
    await fetch(`http://localhost:8000/api/unsave-job/${jobId}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN()}` },
    });
    setUser((prev) =>
      prev ? { ...prev, saved_jobs: prev.saved_jobs.filter((j) => j.id !== jobId) } : prev
    );
  };

  const handleApply = async (job: Job) => {
    await fetch(`http://localhost:8000/api/apply-job/${job.id}/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN()}` },
    });
    setUser((prev) => {
      if (!prev) return prev;
      const exists = prev.applications.some((a) => a.job.id === job.id);
      if (exists) return prev;
      const newApp: Application = {
        id: Date.now(),
        job,
        status: "applied",
        created_at: new Date().toISOString(),
      };
      return { ...prev, applications: [...prev.applications, newApp] };
    });
  };

  const handleStatusChange = async (jobId: number, newStatus: string) => {
    await fetch(`http://localhost:8000/api/application/${jobId}/status/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${TOKEN()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUser((prev) =>
      prev
        ? {
            ...prev,
            applications: prev.applications.map((a) =>
              a.job.id === jobId ? { ...a, status: newStatus as Application["status"] } : a
            ),
          }
        : prev
    );
  };

  if (!user) {
    return (
      <div>
        <header>
          <img src={logo} alt="Logo" className="logo" onClick={() => navigate("/search")} />
        </header>
        <div className="profile-container">
          <div className="skeleton skeleton-title" />
          <div className="skeleton-tabs">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton skeleton-tab" />)}
          </div>
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
      </div>
    );
  }

  const filteredApplications = user.applications.filter(
    (a) => statusFilter === "all" || a.status === statusFilter
  );

  const filteredSaved = user.saved_jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company_name.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <header>
        <img src={logo} alt="Logo" className="logo" onClick={() => navigate("/search")} />
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

        <div className="profile-tabs">
          {["info", "saved", "applied", "analytics"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "info" ? "Information" : tab === "saved" ? "Saved Jobs" : tab === "applied" ? "Applied" : "Analytics"}
            </button>
          ))}
        </div>

        <div className="profile-content">
          {/* INFORMATION */}
          {activeTab === "info" && (
            <div className="info-section">
              <div className="photo-box">
                <div className="photo-placeholder">Photo</div>
                <button className="upload-btn">Upload Photo</button>
              </div>
              <div className="info-fields">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Last Name:</strong> {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <div className="resume-box">
                  <p>
                    <strong>Resume:</strong>{" "}
                    {user.resume ? (
                      <a href={`http://localhost:8000${user.resume}`} target="_blank" rel="noopener noreferrer" className="resume-link">
                        Download Resume
                      </a>
                    ) : "No resume uploaded"}
                  </p>
                  <input type="file" accept="application/pdf" id="resumeUpload" style={{ display: "none" }} onChange={handleResumeUpload} />
                  <button className="upload-btn" onClick={() => document.getElementById("resumeUpload")?.click()}>
                    Upload Resume (PDF)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SAVED JOBS */}
          {activeTab === "saved" && (
            <div className="saved-section">
              <h3>Saved Jobs <span className="count-badge">{user.saved_jobs.length}</span></h3>
              <input
                className="search-input"
                placeholder="Search by title, company, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {filteredSaved.length === 0 ? (
                <p className="empty-msg">{search ? "No jobs match your search." : "No saved jobs yet."}</p>
              ) : (
                <ul className="saved-list">
                  {filteredSaved.map((job) => {
                    const alreadyApplied = user.applications.some((a) => a.job.id === job.id);
                    return (
                      <li key={job.id} className="saved-job-card">
                        <div className="job-card-logo">{job.company_name.charAt(0)}</div>
                        <div className="job-card-info">
                          <h4>{job.title}</h4>
                          <p>{job.company_name}</p>
                          <p>{job.location}</p>
                          <p>{job.salary}</p>
                        </div>
                        <div className="job-card-actions">
                          <button
                            className={`apply-btn ${alreadyApplied ? "applied" : ""}`}
                            disabled={alreadyApplied}
                            onClick={() => handleApply(job)}
                          >
                            {alreadyApplied ? "Applied ✓" : "Apply"}
                          </button>
                          <button className="unsave-btn" onClick={() => handleUnsave(job.id)}>
                            Remove
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* APPLIED / STATUS TRACKING */}
          {activeTab === "applied" && (
            <div className="saved-section">
              <h3>Applications <span className="count-badge">{user.applications.length}</span></h3>
              <div className="status-filter-tabs">
                {["all", "applied", "interviewing", "offer", "rejected"].map((s) => (
                  <button
                    key={s}
                    className={`status-filter-btn ${statusFilter === s ? "active-filter" : ""}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === "all" ? "All" : STATUS_LABELS[s]}
                    <span className="filter-count">
                      {s === "all" ? user.applications.length : user.applications.filter((a) => a.status === s).length}
                    </span>
                  </button>
                ))}
              </div>
              {filteredApplications.length === 0 ? (
                <p className="empty-msg">No applications{statusFilter !== "all" ? ` with status "${STATUS_LABELS[statusFilter]}"` : ""} yet.</p>
              ) : (
                <ul className="saved-list">
                  {filteredApplications.map((app) => (
                    <li key={app.id} className="saved-job-card">
                      <div className="job-card-logo">{app.job.company_name.charAt(0)}</div>
                      <div className="job-card-info">
                        <h4>{app.job.title}</h4>
                        <p>{app.job.company_name}</p>
                        <p>{app.job.location}</p>
                        <p>{app.job.salary}</p>
                      </div>
                      <div className="job-card-actions">
                        <span className="status-badge" style={{ background: STATUS_COLORS[app.status] }}>
                          {STATUS_LABELS[app.status]}
                        </span>
                        <select
                          className="status-select"
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.job.id, e.target.value)}
                        >
                          <option value="applied">Applied</option>
                          <option value="interviewing">Interviewing</option>
                          <option value="offer">Offer</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (() => {
            const locationCounts: Record<string, number> = {};
            user.saved_jobs.forEach((job) => {
              const loc = job.location || "Unknown";
              locationCounts[loc] = (locationCounts[loc] || 0) + 1;
            });
            const chartData = Object.entries(locationCounts).map(([name, value]) => ({ name, value }));
            const COLORS = ["#0f4a2a", "#1a6b3c", "#2d9e5f", "#3ab26e", "#57c98a", "#74d99f"];

            const statusCounts = { applied: 0, interviewing: 0, offer: 0, rejected: 0 };
            user.applications.forEach((a) => { statusCounts[a.status]++; });

            return (
              <div className="analytics-section">
                <h3>My Applications</h3>
                <p className="saved-count">{user.saved_jobs.length} jobs saved · {user.applications.length} applied</p>

                <div className="analytics-stats">
                  {Object.entries(statusCounts).map(([s, count]) => (
                    <div key={s} className="stat-card" style={{ borderTop: `4px solid ${STATUS_COLORS[s]}` }}>
                      <span className="stat-count">{count}</span>
                      <span className="stat-label">{STATUS_LABELS[s]}</span>
                    </div>
                  ))}
                </div>

                {user.saved_jobs.length === 0 ? (
                  <p className="empty-msg">No saved jobs to analyze yet.</p>
                ) : (
                  <div className="chart-wrapper">
                    <h4>Jobs by Location</h4>
                    <ResponsiveContainer width="100%" height={420}>
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value"
                          label={({ name, percent }: { name: string; percent?: number }) => `${name} (${Math.round((percent ?? 0) * 100)}%)`}
                          labelLine={true}
                        >
                          {chartData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => { const v = Number(value ?? 0); return [`Count: ${v} job${v > 1 ? "s" : ""}`, name]; }} />
                        <Legend wrapperStyle={{ color: "#111827", fontSize: "0.85rem" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
