import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./componentcss/admindashboard.css";
import logo from "../assets/square_one_logo.png";
interface Company {
  id: number;
  name: string;
  location: string;
  website: string;
  description: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("company");
  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/");
    }
  }, []);

  // ---------- FETCH COMPANIES ----------
  const token = localStorage.getItem("access");
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/companies/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  const handleSignOut = () => {
    navigate("/");
  };

  // ---------- RANDOM ID GENERATOR ----------
  const generateId = () => Math.floor(Math.random() * 1000000000);

  // ---------- ADD COMPANY ----------
  const handleAddCompany = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const newCompany: Company = {
      id: generateId(),
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      location: (form.elements.namedItem("location") as HTMLInputElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
      description: (
        form.elements.namedItem("description") as HTMLTextAreaElement
      ).value,
    };

    fetch("http://127.0.0.1:8000/api/companies/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCompany),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(() => {
        alert("Company added!");
        setCompanies((prev) => [...prev, newCompany]);
        form.reset();
      })

      .catch((err) => console.error(err));
  };

  // ---------- ADD JOB ----------
  const handleAddJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const token = localStorage.getItem("access");

    // 1. Получаем значения из формы
    let employment_type = (
      form.elements.namedItem("employment_type") as HTMLSelectElement
    ).value;
    let work_mode = (form.elements.namedItem("work_mode") as HTMLSelectElement)
      .value;

    // 2. Приводим employment_type к значениям модели
    if (employment_type === "Full-time") employment_type = "full-time";
    if (employment_type === "Part-time") employment_type = "part-time";
    if (employment_type === "Internship") employment_type = "internship";

    // 3. Приводим work_mode к значениям модели
    if (work_mode === "On-site") work_mode = "onsite";
    if (work_mode === "Remote") work_mode = "remote";
    if (work_mode === "Hybrid") work_mode = "hybrid";
    if (work_mode === "Online") work_mode = "online";

    // 4. benefit — объединяем строки в одну
    const benefitRaw = (
      form.elements.namedItem("benefit") as HTMLTextAreaElement
    ).value;
    const benefit = benefitRaw.replace(/\n/g, ", ");

    // 5. Собираем объект, соответствующий модели Django
    const newJob = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      company_name: (form.elements.namedItem("company") as HTMLSelectElement)
        .value,
      location: (form.elements.namedItem("location") as HTMLInputElement).value,
      salary: (form.elements.namedItem("salary") as HTMLInputElement).value,
      job_type: (form.elements.namedItem("job_type") as HTMLInputElement).value,
      employment_type,
      work_mode,
      requirements: (
        form.elements.namedItem("requirements") as HTMLTextAreaElement
      ).value,
      benefit,
      about_company: (
        form.elements.namedItem("about_company") as HTMLTextAreaElement
      ).value,
      description: (
        form.elements.namedItem("description") as HTMLTextAreaElement
      ).value,
      job_url: (form.elements.namedItem("job_url") as HTMLInputElement).value,
    };

    // 6. Отправляем запрос
    fetch("http://127.0.0.1:8000/api/jobs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newJob),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          console.error("Backend error:", err);
          alert("Error: " + JSON.stringify(err));
          return;
        }

        alert("Job added!");

        // 7. Очищаем форму
        form.reset();
      })
      .catch((err) => console.error("Error adding job:", err));
  };

  return (
    <div className="admin-wrapper">
      {/* ---------- NAVBAR ---------- */}
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

      {/* ---------- CONTENT ---------- */}
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

        {/* ---------- ADD COMPANY ---------- */}
        {activeTab === "company" && (
          <div className="admin-card">
            <h2>Add New Company</h2>

            <form className="admin-form" onSubmit={handleAddCompany}>
              <label>Company Name</label>
              <input name="name" type="text" placeholder="Google" required />

              <label>Location</label>
              <input
                name="location"
                type="text"
                placeholder="New York, NY"
                required
              />

              <label>Website</label>
              <input
                name="website"
                type="text"
                placeholder="https://company.com"
              />

              <label>Description</label>
              <textarea name="description" placeholder="Short description..." />

              <button className="admin-btn">Add Company</button>
            </form>
          </div>
        )}

        {/* ---------- ADD JOB ---------- */}
        {activeTab === "job" && (
          <div className="admin-card">
            <h2>Add New Job</h2>

            <form className="admin-form" onSubmit={handleAddJob}>
              <label>Job Title</label>
              <input
                name="title"
                type="text"
                placeholder="Software Engineer"
                required
              />

              <label>Company</label>
              <select name="company" required>
                <option value="">Select company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label>Location</label>
              <input
                name="location"
                type="text"
                placeholder="San Francisco, CA"
                required
              />

              <label>Salary</label>
              <input name="salary" type="text" placeholder="$120,000" />

              <label>Job Type</label>
              <input name="job_type" type="text" placeholder="Software / IT" />

              <label>Employment Type</label>
              <select name="employment_type">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>

              <label>Work Mode</label>
              <select name="work_mode">
                <option>On-site</option>
                <option>Hybrid</option>
                <option>Remote</option>
              </select>

              <label>Requirements</label>
              <textarea name="requirements" placeholder="Required skills..." />

              <label>Benefits</label>
              <textarea name="benefit" placeholder="Health insurance, PTO..." />

              <label>About Company</label>
              <textarea name="about_company" placeholder="Company info..." />

              <label>Description</label>
              <textarea
                name="description"
                placeholder="Job responsibilities..."
              />

              <label>Job URL</label>
              <input
                name="job_url"
                type="text"
                placeholder="https://apply.com/job"
              />

              <button className="admin-btn">Add Job</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import "./componentcss/admindashboard.css";
// import logo from "../assets/square_one_logo.png";
// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState<"company" | "job">("company");

//   const handleSignOut = () => {
//     //clear token code (localStorage ect)
//     navigate("/");
//   };

//   return (
//     <div className="admin-wrapper">
//       {/* ---------- TOP NAVBAR ---------- */}
//       <div className="admin-navbar">
//         <img
//           src={logo}
//           alt="Logo"
//           className="admin-logo"
//           onClick={() => navigate("/")}
//         />

//         <button className="signout-btn" onClick={handleSignOut}>
//           Sign Out
//         </button>
//       </div>

//       {/* ---------- PAGE CONTENT ---------- */}
//       <div className="admin-container">
//         <h1 className="admin-title">Admin Dashboard</h1>

//         <div className="admin-tabs">
//           <button
//             className={`admin-tab ${activeTab === "company" ? "active" : ""}`}
//             onClick={() => setActiveTab("company")}
//           >
//             Add Company
//           </button>

//           <button
//             className={`admin-tab ${activeTab === "job" ? "active" : ""}`}
//             onClick={() => setActiveTab("job")}
//           >
//             Add Job
//           </button>
//         </div>

//         {activeTab === "company" && (
//           <div className="admin-card">
//             <h2>Add New Company</h2>

//             <form className="admin-form">
//               <label>Company Name</label>
//               <input type="text" placeholder="Google" />

//               <label>Location</label>
//               <input type="text" placeholder="New York, NY" />

//               <label>Website</label>
//               <input type="text" placeholder="https://company.com" />

//               <label>Description</label>
//               <textarea placeholder="Short description..." />

//               <button className="admin-btn">Add Company</button>
//             </form>
//           </div>
//         )}

//         {activeTab === "job" && (
//           <div className="admin-card">
//             <h2>Add New Job</h2>

//             <form className="admin-form">
//               <label>Job Title</label>
//               <input type="text" placeholder="Software Engineer" />

//               <label>Company</label>
//               <input type="text" placeholder="Google" />

//               <label>Location</label>
//               <input type="text" placeholder="San Francisco, CA" />

//               <label>Visa Sponsorship</label>
//               <select>
//                 <option>CPT</option>
//                 <option>OPT</option>
//                 <option>STEM OPT</option>
//                 <option>H-1B</option>
//               </select>

//               <label>Description</label>
//               <textarea placeholder="Job responsibilities..." />

//               <button className="admin-btn">Add Job</button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
