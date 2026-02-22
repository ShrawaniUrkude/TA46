import { calculatePathDistance, calculateWalkingTime, getDirections } from '../../utils/pathfinding';
import './PathGuide.css';

function PathGuide({ path, selectedProduct, selectedTools = [], onStartNavigation, onClearPath }) {
  if (!selectedProduct || path.length === 0) {
    return (
      <div className="path-guide-container empty">
        <div className="empty-state">
          <span className="empty-icon">🧭</span>
          <h3>Navigation Guide</h3>
          <p>Search and select a product to see the shortest path</p>
        </div>
      </div>
    );
  }

  const distance = calculatePathDistance(path);
  const walkTime = calculateWalkingTime(path);
  const directions = getDirections(path, selectedProduct.name, selectedProduct.rack);

  return (
    <div className="path-guide-container">
      <div className="path-guide-header">
        <h2>🧭 Navigation Guide</h2>
        <button className="clear-btn" onClick={onClearPath}>
          ✕ Clear
        </button>
      </div>

      {/* Tool Pickup Info */}
      {selectedTools.length > 0 && (
        <div className="tool-pickup-card">
          <div className="tool-pickup-header">
            <span className="tool-pickup-icon">🧰</span>
            <div>
              <h4>Tools to Pick Up First</h4>
              <span className="tool-pickup-count">{selectedTools.length} tool{selectedTools.length > 1 ? 's' : ''} required</span>
            </div>
          </div>
          <div className="tool-pickup-list">
            {selectedTools.map((tool, index) => (
              <div key={tool.id} className="tool-pickup-item">
                <span className="tool-order">{index + 1}</span>
                <span className="tool-icon">{tool.icon}</span>
                <div className="tool-details">
                  <span className="tool-name">{tool.name}</span>
                  <span className="tool-location">📍 {tool.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Destination info */}
      <div className="destination-card">
        <div className="destination-header">
          <span>📦</span>
          <div>
            <h3>{selectedProduct.name}</h3>
            <span className="destination-location">
              Rack {selectedProduct.rack} • Shelf {selectedProduct.shelf}
            </span>
          </div>
        </div>
        <div className="destination-meta">
          <span className="sku">{selectedProduct.id}</span>
          <span className="category">{selectedProduct.category}</span>
        </div>
      </div>

      {/* Route stats */}
      <div className="route-stats">
        <div className="stat-item">
          <span className="stat-icon">📏</span>
          <div className="stat-content">
            <span className="stat-value">{distance}m</span>
            <span className="stat-label">Distance</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⏱️</span>
          <div className="stat-content">
            <span className="stat-value">{walkTime}</span>
            <span className="stat-label">Est. Time</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📍</span>
          <div className="stat-content">
            <span className="stat-value">{path.length - 1}</span>
            <span className="stat-label">Waypoints</span>
          </div>
        </div>
      </div>

      {/* Turn-by-turn directions */}
      <div className="directions-section">
        <h4>Turn-by-Turn Directions</h4>
        <div className="directions-list">
          {directions.map((dir, index) => (
            <div 
              key={index} 
              className={`direction-item ${index === directions.length - 1 ? 'final' : ''}`}
            >
              <span className="direction-icon">{dir.icon}</span>
              <div className="direction-content">
                <span className="step-number">Step {dir.step}</span>
                <span className="instruction">{dir.instruction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="path-actions">
        <button className="start-nav-btn" onClick={onStartNavigation}>
          <span>🚀</span> Start Navigation
        </button>
        <button className="print-btn">
          <span>🖨️</span> Print Route
        </button>
      </div>

      {/* Quick tips */}
      <div className="tips-section">
        <h5>💡 Tips</h5>
        <ul>
          <li>Follow the blue dashed line on the map</li>
          <li>Green marker = Your position</li>
          <li>Red marker = Product location</li>
        </ul>
      </div>
    </div>
  );
}

export default PathGuide;
