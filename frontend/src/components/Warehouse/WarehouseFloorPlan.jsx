import { useState, useEffect } from 'react';
import { warehouseConfig, warehouseSections, racks, categoryColors } from '../../data/warehouse';
import './WarehouseFloorPlan.css';

function WarehouseFloorPlan({ 
  selectedProduct, 
  path, 
  workerPosition, 
  onRackClick,
  animatingWorker 
}) {
  const { width, height } = warehouseConfig;
  const [hoveredRack, setHoveredRack] = useState(null);

  // Create path string for SVG
  const pathString = path.length > 0 
    ? `M ${path.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  return (
    <div className="floor-plan-container">
      <div className="floor-plan-header">
        <h2>🏭 Warehouse Floor Plan</h2>
        <div className="category-legend">
          {Object.entries(categoryColors).map(([category, color]) => (
            <span key={category} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: color }}></span>
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="floor-plan-wrapper">
        <svg 
          viewBox={`0 0 ${width} ${height}`}
          className="floor-plan-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background grid */}
          <defs>
            <pattern id="warehouse-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5"/>
            </pattern>
            {/* Arrow marker for path */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
            </marker>
            {/* Glow effect for selected product */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width={width} height={height} fill="#F9FAFB" />
          <rect width={width} height={height} fill="url(#warehouse-grid)" />

          {/* Warehouse Sections */}
          {warehouseSections.map(section => (
            <g key={section.id}>
              <rect
                x={section.x}
                y={section.y}
                width={section.width}
                height={section.height}
                fill={section.color}
                fillOpacity="0.15"
                stroke={section.color}
                strokeWidth="2"
                rx="4"
              />
              <text
                x={section.x + section.width / 2}
                y={section.y + section.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={section.color}
                fontSize="12"
                fontWeight="600"
              >
                {section.name}
              </text>
            </g>
          ))}

          {/* Aisles (walkable areas) */}
          <rect x={100} y={100} width={600} height={400} fill="#ffffff" fillOpacity="0.5" rx="4" />

          {/* Racks */}
          {racks.map(rack => {
            const isSelected = selectedProduct?.rack === rack.id;
            const isHovered = hoveredRack === rack.id;
            
            return (
              <g 
                key={rack.id}
                className="rack-group"
                onMouseEnter={() => setHoveredRack(rack.id)}
                onMouseLeave={() => setHoveredRack(null)}
                onClick={() => onRackClick?.(rack)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={rack.x}
                  y={rack.y}
                  width={rack.width}
                  height={rack.height}
                  fill={rack.color}
                  fillOpacity={isSelected ? 0.9 : isHovered ? 0.7 : 0.5}
                  stroke={isSelected ? '#1F2937' : rack.color}
                  strokeWidth={isSelected ? 3 : 1}
                  rx="4"
                  filter={isSelected ? 'url(#glow)' : 'none'}
                />
                {/* Rack label */}
                <text
                  x={rack.x + rack.width / 2}
                  y={rack.y + rack.height / 2 - 8}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="700"
                >
                  {rack.id}
                </text>
                <text
                  x={rack.x + rack.width / 2}
                  y={rack.y + rack.height / 2 + 8}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="500"
                >
                  {rack.category}
                </text>
                
                {/* Shelf lines */}
                {[0.33, 0.66].map((ratio, i) => (
                  <line
                    key={i}
                    x1={rack.x + 5}
                    y1={rack.y + rack.height * ratio}
                    x2={rack.x + rack.width - 5}
                    y2={rack.y + rack.height * ratio}
                    stroke="#ffffff"
                    strokeOpacity="0.4"
                    strokeWidth="1"
                  />
                ))}
              </g>
            );
          })}

          {/* Aisle labels */}
          {['1', '2', '3', '4', '5'].map((num, i) => (
            <text
              key={num}
              x={120 + i * 140}
              y={490}
              textAnchor="middle"
              fill="#6B7280"
              fontSize="11"
              fontWeight="500"
            >
              Aisle {num}
            </text>
          ))}

          {/* Path visualization */}
          {path.length > 1 && (
            <g className="path-group">
              {/* Path shadow */}
              <path
                d={pathString}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="8"
                strokeOpacity="0.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Main path */}
              <path
                d={pathString}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="10 5"
                className="animated-path"
              />
              
              {/* Start point */}
              <circle
                cx={path[0].x}
                cy={path[0].y}
                r="12"
                fill="#10B981"
                stroke="#ffffff"
                strokeWidth="3"
              />
              <text
                x={path[0].x}
                y={path[0].y + 4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
              >
                S
              </text>
              
              {/* End point (destination) */}
              <circle
                cx={path[path.length - 1].x}
                cy={path[path.length - 1].y}
                r="12"
                fill="#EF4444"
                stroke="#ffffff"
                strokeWidth="3"
                className="destination-pulse"
              />
              <text
                x={path[path.length - 1].x}
                y={path[path.length - 1].y + 4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
              >
                📦
              </text>
            </g>
          )}

          {/* Worker position */}
          <g className={`worker-marker ${animatingWorker ? 'animating' : ''}`}>
            <circle
              cx={workerPosition.x}
              cy={workerPosition.y}
              r="20"
              fill="#10B981"
              fillOpacity="0.3"
              className="worker-pulse"
            />
            <circle
              cx={workerPosition.x}
              cy={workerPosition.y}
              r="14"
              fill="#10B981"
              stroke="#ffffff"
              strokeWidth="3"
            />
            <text
              x={workerPosition.x}
              y={workerPosition.y + 5}
              textAnchor="middle"
              fontSize="14"
            >
              👷
            </text>
          </g>

          {/* Selected product marker */}
          {selectedProduct && (
            <g className="product-marker">
              <circle
                cx={selectedProduct.x}
                cy={selectedProduct.y}
                r="18"
                fill="#EF4444"
                fillOpacity="0.3"
                className="product-pulse"
              />
              <circle
                cx={selectedProduct.x}
                cy={selectedProduct.y}
                r="10"
                fill="#EF4444"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={selectedProduct.x}
                y={selectedProduct.y + 4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="8"
                fontWeight="bold"
              >
                📦
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Map controls */}
      <div className="map-controls">
        <div className="zoom-info">
          <span>🔍 Click on any rack to see products</span>
        </div>
      </div>
    </div>
  );
}

export default WarehouseFloorPlan;
