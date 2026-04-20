import { useEffect, useState } from "react";
import "./componentcss/profile.css";
import logo from "../assets/square_one_logo.png";
import { useNavigate } from "react-router";

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
                  {user.saved_jobs.map((job) => (
                    <li key={job.id} className="saved-job-card">
                      <h4>{job.title}</h4>
                      <p>{job.company_name}</p>
                      <p>{job.location}</p>
                      <p>{job.salary}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>{" "}
    </div>
  );
};

export default ProfilePage;
