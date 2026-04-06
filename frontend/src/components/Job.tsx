import { useState, useEffect } from "react";
import "./componentcss/searchpage.css";

interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  salary: string;
  description: string;
  requirements: string;
  benefit: string;
  about_company: string;
  job_url: string;
}

const JobSection = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/jobs/")
      .then((res) => res.json())
      .then((data) => {
        const fetchedJobs: Job[] = data.results || data;
        setJobs(fetchedJobs);
        setSelectedJob(fetchedJobs[0]);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  if (loading) return <div>Fetching jobs from Database...</div>;
  if (!selectedJob) return <div>No jobs found in database.</div>;
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
            <h3 className="title">{job.title}</h3>
            <p className="company">{job.company_name}</p>
            <p className="location">{job.location}</p>
            <p className="salary">{job.salary}</p>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE — JOB DETAILS */}
      <div className="job-details">
        <h3>{selectedJob.title}</h3>
        <p className="company">{selectedJob.company_name}</p>
        <p className="location">{selectedJob.location}</p>

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
