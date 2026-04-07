import { useEffect, useState } from "react";
import "./componentcss/searchpage.css";

interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  salary: string;
  employment_type: string;
  work_mode: string;
  description: string;
  requirements: string;
  benefit: string;
  about_company: string;
  job_url: string;
}

const JobSection = ({
  activeFilters,
  searchQuery,
}: {
  activeFilters: string[];
  searchQuery: string;
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState("description");

  // Fetch jobs from backend
  useEffect(() => {
    fetch("http://localhost:8000/api/jobs/")
      .then((res) => res.json())
      .then((data) => {
        const jobList = Array.isArray(data) ? data : data.results;
        setJobs(jobList);
        if (jobList.length > 0) setSelectedJob(jobList[0]);
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  // FILTERING (fixed for backend structure)
  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      query === "" ||
      job.title.toLowerCase().includes(query) ||
      job.company_name.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.employment_type.toLowerCase().includes(query) ||
      job.work_mode.toLowerCase().includes(query);

    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.some((filter) => {
        const f = filter.toLowerCase();
        return (
          job.employment_type.toLowerCase().includes(f) ||
          job.work_mode.toLowerCase().includes(f)
        );
      });

    return matchesSearch && matchesFilters;
  });

  if (!selectedJob) {
    return <p style={{ padding: "20px" }}>Loading jobs...</p>;
  }

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
              <p className="company">{job.company_name}</p>
              <p className="location">{job.location}</p>
              <p className="salary">{job.salary}</p>

              <div className="tags">
                <span className="tag">{job.employment_type}</span>
                <span className="tag">{job.work_mode}</span>
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
            onClick={() => window.open(selectedJob.job_url, "_blank")}
          >
            Apply
          </button>
        </div>

        <h3>{selectedJob.title}</h3>
        <p className="company">{selectedJob.company_name}</p>
        <p className="location">{selectedJob.location}</p>

        <div className="tags">
          <span className="tag">{selectedJob.employment_type}</span>
          <span className="tag">{selectedJob.work_mode}</span>
        </div>

        {/* TABS */}
        <div className="tabs">
          {["description", "requirements", "benefit", "about"].map((tab) => (
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
            href={selectedJob.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="apply-btn"
          >
            Apply Now
          </a>

          {activeTab === "description" && <p>{selectedJob.description}</p>}
          {activeTab === "requirements" && <p>{selectedJob.requirements}</p>}
          {activeTab === "benefit" && <p>{selectedJob.benefit}</p>}
          {activeTab === "about" && <p>{selectedJob.about_company}</p>}
        </div>
      </div>
    </div>
  );
};

export default JobSection;
