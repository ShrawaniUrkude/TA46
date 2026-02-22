import { assetTypes } from '../../data/assets';
import './SearchBar.css';

function SearchBar({ searchQuery, onSearchChange, typeFilter, onTypeFilterChange, statusFilter, onStatusFilterChange }) {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search assets by name, ID, or location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button className="clear-btn" onClick={() => onSearchChange('')}>
            ✕
          </button>
        )}
      </div>
      
      <div className="filter-group">
        <select 
          value={typeFilter} 
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          {Object.entries(assetTypes).map(([key, type]) => (
            <option key={key} value={key}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>
        
        <select 
          value={statusFilter} 
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="idle">Idle</option>
          <option value="maintenance">Maintenance</option>
          <option value="offline">Offline</option>
        </select>
      </div>
    </div>
  );
}

export default SearchBar;
