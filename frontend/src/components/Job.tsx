import { useState } from "react";
import { jobs } from "./jobs"; // твой массив
import "./componentcss/searchpage.css";

const JobSection = () => {
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="job-page">
      {/* LEFT SIDE — LIST OF JOBS */}
      <div className="job-list">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`job-card ${selectedJob.id === job.id ? "active" : ""}`}
            onClick={() => setSelectedJob(job)}
          >
            <div className="job-card-header">
              <div className="job-icon" />
              <button className="apply-btn-small">Apply</button>
            </div>

            <h3 className="title">{job.title}</h3>
            <p className="company">{job.company}</p>
            <p className="location">{job.location}</p>
            <p className="salary">{job.salary}</p>

            <div className="tags">
              {job.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE — JOB DETAILS */}
      <div className="job-details">
        <div className="details-header">
          <div className="job-icon-large" />
          <button
            className="apply-btn"
            onClick={() => window.open(selectedJob.applyUrl, "_blank")}
          >
            Apply
          </button>
        </div>

        <h2>{selectedJob.title}</h2>
        <p className="company">{selectedJob.company}</p>
        <p className="location">{selectedJob.location}</p>

        <div className="tags">
          {selectedJob.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>

        {/* TABS */}
        <div className="tabs">
          {["description", "qualification", "benefits", "about"].map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </div>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="tab-content">
          {activeTab === "description" && <p>{selectedJob.description}</p>}
          {activeTab === "qualification" && (
            <p>{selectedJob.qualification || "No qualifications provided."}</p>
          )}
          {activeTab === "benefits" && (
            <p>{selectedJob.benefits || "No benefits listed."}</p>
          )}
          {activeTab === "about" && (
            <p>{selectedJob.aboutCompany || "No company info available."}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSection;
