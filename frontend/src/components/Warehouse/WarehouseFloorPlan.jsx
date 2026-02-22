import { useState, useEffect } from 'react';
import { warehouseConfig, warehouseSections, racks, categoryColors } from '../../data/warehouse';
import './WarehouseFloorPlan.css';

// Equipment data with real-time positions
const warehouseEquipment = [
  { id: 'FL-001', type: 'forklift', name: 'Forklift #1', x: 150, y: 450, status: 'active', operator: 'John D.', battery: 85 },
  { id: 'FL-002', type: 'forklift', name: 'Forklift #2', x: 550, y: 150, status: 'active', operator: 'Mike S.', battery: 62 },
  { id: 'FL-003', type: 'forklift', name: 'Forklift #3', x: 680, y: 380, status: 'idle', operator: 'Unassigned', battery: 100 },
  { id: 'PJ-001', type: 'pallet_jack', name: 'Pallet Jack #1', x: 250, y: 280, status: 'active', operator: 'Sarah L.', battery: 74 },
  { id: 'PJ-002', type: 'pallet_jack', name: 'Pallet Jack #2', x: 420, y: 350, status: 'active', operator: 'Tom R.', battery: 91 },
  { id: 'PJ-003', type: 'pallet_jack', name: 'Pallet Jack #3', x: 180, y: 180, status: 'maintenance', operator: 'N/A', battery: 0 },
  { id: 'DT-001', type: 'diagnostic_tool', name: 'Scanner Pro X1', x: 380, y: 200, status: 'active', operator: 'Lisa K.', battery: 58 },
  { id: 'DT-002', type: 'diagnostic_tool', name: 'Inventory Scanner', x: 480, y: 420, status: 'active', operator: 'James W.', battery: 43 },
  { id: 'DT-003', type: 'diagnostic_tool', name: 'Barcode Reader', x: 320, y: 130, status: 'charging', operator: 'N/A', battery: 25 },
];

const equipmentIcons = {
  forklift: '🚜',
  pallet_jack: '🏗️',
  diagnostic_tool: '📱'
};

const equipmentColors = {
  forklift: '#F59E0B',
  pallet_jack: '#8B5CF6',
  diagnostic_tool: '#06B6D4'
};

const statusColors = {
  active: '#10B981',
  idle: '#6B7280',
  maintenance: '#EF4444',
  charging: '#3B82F6'
};

function WarehouseFloorPlan({ 
  selectedProduct, 
  path, 
  workerPosition, 
  onRackClick,
  animatingWorker 
}) {
  const { width, height } = warehouseConfig;
  const [hoveredRack, setHoveredRack] = useState(null);
  const [hoveredEquipment, setHoveredEquipment] = useState(null);
  const [showEquipment, setShowEquipment] = useState(true);
  const [equipment, setEquipment] = useState(warehouseEquipment);

  // Simulate equipment movement
  useEffect(() => {
    const interval = setInterval(() => {
      setEquipment(prev => prev.map(eq => {
        if (eq.status === 'active') {
          return {
            ...eq,
            x: Math.max(120, Math.min(680, eq.x + (Math.random() - 0.5) * 10)),
            y: Math.max(120, Math.min(480, eq.y + (Math.random() - 0.5) * 10))
          };
        }
        return eq;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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

          {/* Equipment tracking markers */}
          {showEquipment && equipment.map(eq => {
            const isHovered = hoveredEquipment === eq.id;
            return (
              <g 
                key={eq.id}
                className={`equipment-marker ${eq.status}`}
                onMouseEnter={() => setHoveredEquipment(eq.id)}
                onMouseLeave={() => setHoveredEquipment(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Equipment pulse ring */}
                <circle
                  cx={eq.x}
                  cy={eq.y}
                  r={isHovered ? 24 : 18}
                  fill={equipmentColors[eq.type]}
                  fillOpacity="0.2"
                  className={eq.status === 'active' ? 'equipment-pulse' : ''}
                />
                {/* Status ring */}
                <circle
                  cx={eq.x}
                  cy={eq.y}
                  r="14"
                  fill={equipmentColors[eq.type]}
                  stroke={statusColors[eq.status]}
                  strokeWidth="3"
                />
                {/* Equipment icon */}
                <text
                  x={eq.x}
                  y={eq.y + 5}
                  textAnchor="middle"
                  fontSize="12"
                >
                  {equipmentIcons[eq.type]}
                </text>
                
                {/* Tooltip on hover */}
                {isHovered && (
                  <g className="equipment-tooltip">
                    <rect
                      x={eq.x + 20}
                      y={eq.y - 50}
                      width="130"
                      height="85"
                      fill="#1F2937"
                      fillOpacity="0.95"
                      rx="6"
                    />
                    <text x={eq.x + 30} y={eq.y - 32} fill="#fff" fontSize="10" fontWeight="600">{eq.name}</text>
                    <text x={eq.x + 30} y={eq.y - 18} fill="#9CA3AF" fontSize="9">ID: {eq.id}</text>
                    <text x={eq.x + 30} y={eq.y - 4} fill="#9CA3AF" fontSize="9">Operator: {eq.operator}</text>
                    <text x={eq.x + 30} y={eq.y + 10} fill={statusColors[eq.status]} fontSize="9" fontWeight="500">
                      Status: {eq.status.charAt(0).toUpperCase() + eq.status.slice(1)}
                    </text>
                    <text x={eq.x + 30} y={eq.y + 24} fill="#9CA3AF" fontSize="9">
                      Battery: {eq.battery}%
                    </text>
                    {/* Battery bar */}
                    <rect x={eq.x + 85} y={eq.y + 16} width="50" height="6" fill="#374151" rx="3" />
                    <rect 
                      x={eq.x + 85} 
                      y={eq.y + 16} 
                      width={eq.battery / 2} 
                      height="6" 
                      fill={eq.battery > 50 ? '#10B981' : eq.battery > 20 ? '#F59E0B' : '#EF4444'}
                      rx="3" 
                    />
                  </g>
                )}
              </g>
            );
          })}

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

      {/* Equipment Tracking Panel */}
      <div className="equipment-tracking-panel">
        <div className="equipment-panel-header">
          <h3>🔴 Live Equipment Tracking</h3>
          <button 
            className={`toggle-btn ${showEquipment ? 'active' : ''}`}
            onClick={() => setShowEquipment(!showEquipment)}
          >
            {showEquipment ? 'Hide' : 'Show'}
          </button>
        </div>
        
        <div className="equipment-legend">
          <div className="legend-section">
            <span className="legend-title">Equipment Types:</span>
            <div className="legend-items">
              <span className="legend-item">
                <span className="legend-icon" style={{ backgroundColor: equipmentColors.forklift }}>🚜</span>
                Forklifts ({equipment.filter(e => e.type === 'forklift').length})
              </span>
              <span className="legend-item">
                <span className="legend-icon" style={{ backgroundColor: equipmentColors.pallet_jack }}>🏗️</span>
                Pallet Jacks ({equipment.filter(e => e.type === 'pallet_jack').length})
              </span>
              <span className="legend-item">
                <span className="legend-icon" style={{ backgroundColor: equipmentColors.diagnostic_tool }}>📱</span>
                Diagnostic Tools ({equipment.filter(e => e.type === 'diagnostic_tool').length})
              </span>
            </div>
          </div>
          <div className="legend-section">
            <span className="legend-title">Status:</span>
            <div className="legend-items">
              <span className="status-item"><span className="status-dot" style={{ backgroundColor: statusColors.active }}></span>Active</span>
              <span className="status-item"><span className="status-dot" style={{ backgroundColor: statusColors.idle }}></span>Idle</span>
              <span className="status-item"><span className="status-dot" style={{ backgroundColor: statusColors.maintenance }}></span>Maintenance</span>
              <span className="status-item"><span className="status-dot" style={{ backgroundColor: statusColors.charging }}></span>Charging</span>
            </div>
          </div>
        </div>

        <div className="equipment-list">
          {equipment.map(eq => (
            <div 
              key={eq.id} 
              className={`equipment-item ${eq.status}`}
              onMouseEnter={() => setHoveredEquipment(eq.id)}
              onMouseLeave={() => setHoveredEquipment(null)}
            >
              <span className="eq-icon" style={{ backgroundColor: equipmentColors[eq.type] }}>
                {equipmentIcons[eq.type]}
              </span>
              <div className="eq-info">
                <span className="eq-name">{eq.name}</span>
                <span className="eq-operator">{eq.operator}</span>
              </div>
              <div className="eq-status">
                <span className="status-badge" style={{ backgroundColor: statusColors[eq.status] }}>
                  {eq.status}
                </span>
                <span className="eq-battery">🔋 {eq.battery}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WarehouseFloorPlan;
