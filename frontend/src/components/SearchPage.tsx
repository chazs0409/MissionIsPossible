import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "./componentcss/searchpage.css";
import JobSection from "./Job";
import logo from "../assets/square_one_logo.png";
import { useNavigate } from "react-router-dom";

const filters = ["Full-Time", "Part-Time", "Remote", "Onsite", "Internship"];

const SearchPage = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  const clearAll = () => setActiveFilters([]);
  const navigate = useNavigate();

  return (
    <div className="search-page container">
      <img src={logo} className="logo" onClick={() => navigate("/")} />
      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Job title, skill, company, keyword"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>

      {/* Filters row */}
      <div className="filters-row">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${
              activeFilters.includes(filter) ? "active" : ""
            }`}
            onClick={() => toggleFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="divider" />

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="active-filters">
          {activeFilters.map((filter) => (
            <div key={filter} className="filter-tag">
              {filter}
              <FaTimes
                onClick={() => removeFilter(filter)}
                style={{ cursor: "pointer" }}
              />
            </div>
          ))}

          <div className="remove-filters" onClick={clearAll}>
            <FaTimes />
            <span>Remove all filters</span>
          </div>
        </div>
      )}

      {/* Job list + details */}
      <JobSection activeFilters={activeFilters} searchQuery={searchQuery} />
    </div>
  );
};

export default SearchPage;
