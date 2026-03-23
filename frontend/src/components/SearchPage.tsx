import { FaSearch, FaTimes } from "react-icons/fa";
// import { FaSearch } from "react-icons/fa";
// import FaTimes from "react-icons"
import "./componentcss/searchpage.css";
import JobSection from "./Job";

const SearchPage = () => {
  return (
    <div className="search-page container">
      {/* Search bar */}
      <div className="search-bar">
        <input type="text" placeholder="Job title, skill, company, keyword" />
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>

      {/* Filters row */}
      <div className="filters-row">
        <button className="filter-btn">Filter 1</button>
        <button className="filter-btn">Filter 1</button>
        <button className="filter-btn">Filter 1</button>
        <button className="filter-btn">Filter 1</button>
      </div>

      {/* Divider */}
      <div className="divider" />

      {/* Active filters */}
      <div className="active-filters">
        <div className="filter-tag">
          Filter 2 <FaTimes />
        </div>
        <div className="filter-tag">
          Filter 3 <FaTimes />
        </div>

        <div className="remove-filters">
          <FaTimes />
          <span>Remove filters</span>
        </div>
      </div>
      <JobSection />
    </div>
  );
};

export default SearchPage;
