import { useState } from "react";
import { jobs } from "./jobs";
import "./componentcss/searchpage.css";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  description: string;
  qualification: string;
  benefits: string;
  aboutCompany: string;
  applyUrl: string;
}

const JobSection = ({
  activeFilters,
  searchQuery,
}: {
  activeFilters: string[];
  searchQuery: string;
}) => {
  const [selectedJob, setSelectedJob] = useState<Job>(jobs[0]);
  const [activeTab, setActiveTab] = useState("description");

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      query === "" ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.tags.some((tag) => tag.toLowerCase().includes(query));

    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.some((filter) =>
        job.tags.some((tag) =>
          tag.toLowerCase().includes(filter.toLowerCase())
        )
      );

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="job-page">
      {/* LEFT SIDE — LIST OF JOBS */}
      <div className="job-list">
        {filteredJobs.length === 0 ? (
          <p style={{ color: "#6b7280", padding: "20px" }}>
            No jobs match your search or filters.
          </p>
        ) : (
          filteredJobs.map((job) => (
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
          ))
        )}
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
          <a
            href={selectedJob.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="apply-btn"
          >
            Apply Now
          </a>

          {activeTab === "description" && <p>{selectedJob.description}</p>}
          {activeTab === "qualification" && <p>{selectedJob.qualification}</p>}
          {activeTab === "benefits" && <p>{selectedJob.benefits}</p>}
          {activeTab === "about" && <p>{selectedJob.aboutCompany}</p>}
        </div>
      </div>
    </div>
  );
};

export default JobSection;
