import { useState, useEffect } from "react";
import "./componentcss/searchpage.css";

const JobSection = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This calls Django backend
    fetch("http://127.0.0.1:8000/api/jobs/")
      .then((res) => res.json())
      .then((data) => {
        // Django REST Framework often puts data in a .results array
        const fetchedJobs = data.results || data;
        setJobs(fetchedJobs);
        setSelectedJob(fetchedJobs[0]);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  if (loading) return <div>Fetching jobs from Database...</div>;
  if (jobs.length === 0) return <div>No jobs found in database.</div>;

  return (
    <div className="job-page">
      {/* LEFT SIDE — LIST OF JOBS */}
      <div className="job-list">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`job-card ${selectedJob?.id === job.id ? "active" : ""}`}
            onClick={() => setSelectedJob(job)}
          >
            <h3 className="title">{job.title}</h3>
            <p className="company">{job.company_name}</p>
            <p className="location">{job.location}</p>
            <p className="salary">{job.salary}</p>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE — JOB DETAILS */}
      <div className="job-details">
        <h2>{selectedJob.title}</h2>
        <p className="company">{selectedJob.company_name}</p>
        <p className="location">{selectedJob.location}</p>

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