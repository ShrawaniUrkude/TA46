import { useState, useRef, useEffect } from 'react';
import { racks, warehouseSections, products, categoryColors } from '../../data/warehouse';
import './Warehouse3D.css';

function Warehouse3D({ selectedProduct, path, workerPosition, onProductSelect }) {
  const [rotateX, setRotateX] = useState(55);
  const [rotateZ, setRotateZ] = useState(-45);
  const [zoom, setZoom] = useState(0.6);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Mouse controls for rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;
    
    setRotateZ(prev => prev + deltaX * 0.5);
    setRotateX(prev => Math.max(20, Math.min(80, prev - deltaY * 0.5)));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.3, Math.min(1.2, prev - e.deltaY * 0.001)));
  };

  // Reset view
  const resetView = () => {
    setRotateX(55);
    setRotateZ(-45);
    setZoom(0.6);
  };

  // Preset views
  const setTopView = () => {
    setRotateX(90);
    setRotateZ(0);
  };

  const setFrontView = () => {
    setRotateX(10);
    setRotateZ(0);
  };

  const setSideView = () => {
    setRotateX(10);
    setRotateZ(-90);
  };

  // Get rack height based on shelf count
  const getRackHeight = (rack) => {
    const rackProducts = products.filter(p => p.rack === rack.id);
    const maxShelf = Math.max(...rackProducts.map(p => p.shelf), 1);
    return 30 + maxShelf * 25;
  };

  // Scale coordinates to 3D space
  const scale = 0.4;

  return (
    <div className="warehouse-3d-container">
      <div className="view-controls">
        <h3>🎮 3D Controls</h3>
        <div className="control-buttons">
          <button onClick={resetView} className="control-btn">
            🔄 Reset
          </button>
          <button onClick={setTopView} className="control-btn">
            ⬆️ Top
          </button>
          <button onClick={setFrontView} className="control-btn">
            👁️ Front
          </button>
          <button onClick={setSideView} className="control-btn">
            👈 Side
          </button>
        </div>
        <div className="zoom-control">
          <span>🔍 Zoom</span>
          <input
            type="range"
            min="0.3"
            max="1.2"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
          />
        </div>
        <p className="control-hint">Drag to rotate • Scroll to zoom</p>
      </div>

      <div
        ref={containerRef}
        className="scene-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="scene"
          style={{
            transform: `
              scale(${zoom})
              rotateX(${rotateX}deg)
              rotateZ(${rotateZ}deg)
            `,
          }}
        >
          {/* Floor */}
          <div className="floor">
            <div className="floor-grid"></div>
            
            {/* Floor sections */}
            {warehouseSections.map(section => (
              <div
                key={section.id}
                className="floor-section"
                style={{
                  left: `${section.x * scale}px`,
                  top: `${section.y * scale}px`,
                  width: `${section.width * scale}px`,
                  height: `${section.height * scale}px`,
                  backgroundColor: section.color,
                }}
              >
                <span className="section-label">{section.name}</span>
              </div>
            ))}

            {/* Path on floor */}
            {path.length > 1 && (
              <svg className="path-svg" viewBox="0 0 360 240">
                <defs>
                  <marker
                    id="arrow3d"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                  </marker>
                </defs>
                <path
                  d={`M ${path.map(p => `${p.x * scale} ${p.y * scale}`).join(' L ')}`}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="4"
                  strokeDasharray="8 4"
                  className="animated-path-3d"
                  markerEnd="url(#arrow3d)"
                />
              </svg>
            )}
          </div>

          {/* 3D Racks */}
          {racks.map(rack => {
            const isSelected = selectedProduct?.rack === rack.id;
            const rackHeight = getRackHeight(rack);
            const rackProducts = products.filter(p => p.rack === rack.id);
            
            return (
              <div
                key={rack.id}
                className={`rack-3d ${isSelected ? 'selected' : ''}`}
                style={{
                  left: `${rack.x * scale}px`,
                  top: `${rack.y * scale}px`,
                  width: `${rack.width * scale}px`,
                  height: `${rack.height * scale}px`,
                  '--rack-height': `${rackHeight}px`,
                  '--rack-color': rack.color,
                }}
                onClick={() => {
                  if (rackProducts.length > 0) {
                    onProductSelect(rackProducts[0]);
                  }
                }}
              >
                {/* Rack base */}
                <div className="rack-base"></div>
                
                {/* Rack front face */}
                <div className="rack-front">
                  <span className="rack-label">{rack.id}</span>
                </div>
                
                {/* Rack back face */}
                <div className="rack-back"></div>
                
                {/* Rack left face */}
                <div className="rack-left"></div>
                
                {/* Rack right face */}
                <div className="rack-right"></div>
                
                {/* Rack top face */}
                <div className="rack-top"></div>

                {/* Shelves */}
                {[1, 2, 3].map(shelfNum => (
                  <div
                    key={shelfNum}
                    className="shelf-3d"
                    style={{
                      '--shelf-y': `${shelfNum * 25}px`,
                    }}
                  >
                    {/* Products on shelf */}
                    {rackProducts
                      .filter(p => p.shelf === shelfNum)
                      .map((product, idx) => (
                        <div
                          key={product.id}
                          className={`product-box ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                          style={{
                            left: `${5 + idx * 12}px`,
                            backgroundColor: categoryColors[product.category],
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onProductSelect(product);
                          }}
                          title={product.name}
                        >
                          📦
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Worker marker */}
          <div
            className="worker-3d"
            style={{
              left: `${workerPosition.x * scale}px`,
              top: `${workerPosition.y * scale}px`,
            }}
          >
            <div className="worker-body">
              <div className="worker-head">👷</div>
              <div className="worker-shadow"></div>
            </div>
            <div className="worker-pulse"></div>
          </div>

          {/* Destination marker */}
          {selectedProduct && (
            <div
              className="destination-3d"
              style={{
                left: `${selectedProduct.x * scale}px`,
                top: `${selectedProduct.y * scale}px`,
              }}
            >
              <div className="destination-pin">
                <div className="pin-head">📍</div>
                <div className="pin-beam"></div>
              </div>
              <div className="destination-label">
                {selectedProduct.name}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="legend-3d">
        <div className="legend-item">
          <span className="legend-icon">👷</span> Worker
        </div>
        <div className="legend-item">
          <span className="legend-icon">📍</span> Destination
        </div>
        <div className="legend-item">
          <span className="legend-icon" style={{ color: '#3B82F6' }}>- -</span> Path
        </div>
      </div>

      {/* Selected product info */}
      {selectedProduct && (
        <div className="selected-info-3d">
          <div className="info-header">
            <span>📦</span>
            <strong>{selectedProduct.name}</strong>
          </div>
          <div className="info-details">
            <span>Rack {selectedProduct.rack}</span>
            <span>•</span>
            <span>Shelf {selectedProduct.shelf}</span>
            <span>•</span>
            <span>{selectedProduct.quantity} units</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Warehouse3D;
