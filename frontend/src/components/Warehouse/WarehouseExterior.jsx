import { useState } from 'react';
import './WarehouseExterior.css';

function WarehouseExterior({ onEnterWarehouse }) {
  const [hoveredArea, setHoveredArea] = useState(null);

  const exteriorAreas = [
    { id: 'main-building', name: 'Main Warehouse', x: 200, y: 150, width: 500, height: 300, type: 'building' },
    { id: 'receiving-dock', name: 'Receiving Dock', x: 200, y: 100, width: 150, height: 50, type: 'dock' },
    { id: 'shipping-dock', name: 'Shipping Dock', x: 550, y: 100, width: 150, height: 50, type: 'dock' },
    { id: 'loading-bay-1', name: 'Loading Bay 1', x: 200, y: 450, width: 100, height: 60, type: 'loading' },
    { id: 'loading-bay-2', name: 'Loading Bay 2', x: 320, y: 450, width: 100, height: 60, type: 'loading' },
    { id: 'loading-bay-3', name: 'Loading Bay 3', x: 440, y: 450, width: 100, height: 60, type: 'loading' },
    { id: 'loading-bay-4', name: 'Loading Bay 4', x: 560, y: 450, width: 100, height: 60, type: 'loading' },
    { id: 'truck-parking', name: 'Truck Parking', x: 200, y: 520, width: 460, height: 80, type: 'parking' },
    { id: 'employee-parking', name: 'Employee Parking', x: 720, y: 150, width: 150, height: 200, type: 'parking' },
    { id: 'visitor-parking', name: 'Visitor Parking', x: 720, y: 370, width: 150, height: 100, type: 'parking' },
    { id: 'main-entrance', name: 'Main Entrance', x: 700, y: 280, width: 20, height: 60, type: 'entrance' },
    { id: 'emergency-exit-1', name: 'Emergency Exit', x: 200, y: 280, width: 15, height: 40, type: 'emergency' },
    { id: 'emergency-exit-2', name: 'Emergency Exit', x: 400, y: 450, width: 40, height: 15, type: 'emergency' },
    { id: 'security-booth', name: 'Security Booth', x: 720, y: 480, width: 60, height: 50, type: 'security' },
    { id: 'office-wing', name: 'Office Wing', x: 50, y: 200, width: 130, height: 150, type: 'office' },
    { id: 'break-room', name: 'Break Room', x: 50, y: 360, width: 80, height: 80, type: 'amenity' },
    { id: 'fuel-station', name: 'Fuel Station', x: 50, y: 500, width: 100, height: 70, type: 'utility' },
  ];

  const roads = [
    { id: 'road-1', name: 'Main Road', points: '0,620 900,620 900,650 0,650' },
    { id: 'road-2', name: 'Access Road', points: '800,100 900,100 900,620 800,620 800,520 850,520 850,150 800,150' },
    { id: 'driveway', name: 'Driveway', points: '680,620 780,620 780,520 680,520' },
  ];

  const getAreaColor = (type) => {
    const colors = {
      building: '#3B82F6',
      dock: '#10B981',
      loading: '#F59E0B',
      parking: '#6B7280',
      entrance: '#10B981',
      emergency: '#EF4444',
      security: '#8B5CF6',
      office: '#EC4899',
      amenity: '#14B8A6',
      utility: '#F97316',
    };
    return colors[type] || '#6B7280';
  };

  const getAreaIcon = (type) => {
    const icons = {
      building: '🏭',
      dock: '📦',
      loading: '🚛',
      parking: '🅿️',
      entrance: '🚪',
      emergency: '🚨',
      security: '🛡️',
      office: '🏢',
      amenity: '☕',
      utility: '⛽',
    };
    return icons[type] || '📍';
  };

  return (
    <div className="warehouse-exterior-container">
      <div className="exterior-header">
        <h2>🗺️ Warehouse Facility Map</h2>
        <p>Aerial view of the entire warehouse complex</p>
      </div>

      <div className="exterior-map-wrapper">
        <svg viewBox="0 0 900 680" className="exterior-svg">
          {/* Background */}
          <defs>
            <pattern id="grass" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#86EFAC" />
              <circle cx="5" cy="5" r="1" fill="#4ADE80" />
              <circle cx="15" cy="15" r="1" fill="#4ADE80" />
            </pattern>
            <pattern id="asphalt" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#4B5563" />
              <rect width="2" height="2" x="4" y="4" fill="#374151" />
            </pattern>
            <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="3" dy="3" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Grass background */}
          <rect width="900" height="680" fill="url(#grass)" />

          {/* Roads */}
          {roads.map(road => (
            <polygon
              key={road.id}
              points={road.points}
              fill="url(#asphalt)"
              stroke="#374151"
              strokeWidth="2"
            />
          ))}

          {/* Road markings */}
          <line x1="0" y1="635" x2="900" y2="635" stroke="#FCD34D" strokeWidth="3" strokeDasharray="20 10" />
          <line x1="850" y1="150" x2="850" y2="520" stroke="#FCD34D" strokeWidth="2" strokeDasharray="15 8" />

          {/* Parking lot lines */}
          <g className="parking-lines" stroke="#ffffff" strokeWidth="1">
            {/* Employee parking */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <line key={`emp-${i}`} x1={720} y1={170 + i * 30} x2={870} y2={170 + i * 30} />
            ))}
            {/* Visitor parking */}
            {[0, 1, 2].map(i => (
              <line key={`vis-${i}`} x1={720} y1={390 + i * 30} x2={870} y2={390 + i * 30} />
            ))}
            {/* Truck parking */}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={`truck-${i}`} x1={200 + i * 100} y1={520} x2={200 + i * 100} y2={600} />
            ))}
          </g>

          {/* Areas */}
          {exteriorAreas.map(area => {
            const isHovered = hoveredArea === area.id;
            const isMainBuilding = area.type === 'building';
            
            return (
              <g
                key={area.id}
                className={`exterior-area ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredArea(area.id)}
                onMouseLeave={() => setHoveredArea(null)}
                onClick={() => isMainBuilding && onEnterWarehouse?.()}
                style={{ cursor: isMainBuilding ? 'pointer' : 'default' }}
              >
                <rect
                  x={area.x}
                  y={area.y}
                  width={area.width}
                  height={area.height}
                  fill={isMainBuilding ? 'url(#buildingGradient)' : getAreaColor(area.type)}
                  fillOpacity={isMainBuilding ? 1 : 0.8}
                  stroke={isHovered ? '#ffffff' : getAreaColor(area.type)}
                  strokeWidth={isHovered ? 3 : 1}
                  rx="4"
                  filter={isMainBuilding ? 'url(#shadow)' : 'none'}
                />
                
                {/* Area label */}
                <text
                  x={area.x + area.width / 2}
                  y={area.y + area.height / 2 - 5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={area.type === 'building' ? '16' : '10'}
                  fontWeight="600"
                >
                  {getAreaIcon(area.type)}
                </text>
                <text
                  x={area.x + area.width / 2}
                  y={area.y + area.height / 2 + 12}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={area.type === 'building' ? '14' : '8'}
                  fontWeight="500"
                >
                  {area.name}
                </text>

                {/* Click hint for main building */}
                {isMainBuilding && (
                  <text
                    x={area.x + area.width / 2}
                    y={area.y + area.height / 2 + 35}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    opacity="0.8"
                  >
                    Click to enter
                  </text>
                )}
              </g>
            );
          })}

          {/* Trucks at loading bays */}
          <g className="trucks">
            <rect x="210" y="460" width="80" height="35" fill="#374151" rx="3" />
            <rect x="215" y="463" width="25" height="29" fill="#60A5FA" rx="2" />
            <text x="250" y="485" fill="#ffffff" fontSize="20">🚛</text>
            
            <rect x="450" y="460" width="80" height="35" fill="#374151" rx="3" />
            <rect x="455" y="463" width="25" height="29" fill="#F59E0B" rx="2" />
            <text x="490" y="485" fill="#ffffff" fontSize="20">🚛</text>
          </g>

          {/* Parked cars in employee parking */}
          <g className="cars">
            {[0, 1, 2, 3].map(i => (
              <text key={`car-${i}`} x={740 + (i % 2) * 60} y={190 + Math.floor(i / 2) * 60} fontSize="18">
                🚗
              </text>
            ))}
            <text x="740" y="410" fontSize="18">🚙</text>
          </g>

          {/* Direction arrows */}
          <g className="directions">
            <text x="820" y="80" fill="#374151" fontSize="12" fontWeight="600">↑ City Center</text>
            <text x="30" y="640" fill="#374151" fontSize="12" fontWeight="600">← Highway</text>
          </g>

          {/* Compass */}
          <g className="compass" transform="translate(50, 50)">
            <circle cx="0" cy="0" r="25" fill="#ffffff" stroke="#374151" strokeWidth="2" />
            <text x="0" y="-8" textAnchor="middle" fill="#EF4444" fontSize="14" fontWeight="bold">N</text>
            <text x="0" y="16" textAnchor="middle" fill="#374151" fontSize="10">S</text>
            <text x="-12" y="4" textAnchor="middle" fill="#374151" fontSize="10">W</text>
            <text x="12" y="4" textAnchor="middle" fill="#374151" fontSize="10">E</text>
            <polygon points="0,-20 -4,-10 4,-10" fill="#EF4444" />
          </g>

          {/* Scale */}
          <g className="scale" transform="translate(750, 50)">
            <line x1="0" y1="0" x2="100" y2="0" stroke="#374151" strokeWidth="2" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#374151" strokeWidth="2" />
            <line x1="100" y1="-5" x2="100" y2="5" stroke="#374151" strokeWidth="2" />
            <text x="50" y="15" textAnchor="middle" fill="#374151" fontSize="10">100m</text>
          </g>

          {/* Hover tooltip */}
          {hoveredArea && (
            <g className="tooltip">
              {exteriorAreas.filter(a => a.id === hoveredArea).map(area => (
                <g key={`tooltip-${area.id}`}>
                  <rect
                    x={area.x + area.width / 2 - 50}
                    y={area.y - 35}
                    width="100"
                    height="25"
                    fill="#1F2937"
                    rx="4"
                  />
                  <text
                    x={area.x + area.width / 2}
                    y={area.y - 18}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                  >
                    {area.name}
                  </text>
                </g>
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="exterior-legend">
        <div className="legend-title">Legend</div>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#3B82F6' }}></span>
            <span>Main Building</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#10B981' }}></span>
            <span>Docks & Entrances</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#F59E0B' }}></span>
            <span>Loading Bays</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#6B7280' }}></span>
            <span>Parking Areas</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#EC4899' }}></span>
            <span>Office Wing</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#EF4444' }}></span>
            <span>Emergency Exits</span>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="facility-info">
        <div className="info-card">
          <span className="info-icon">📐</span>
          <div className="info-content">
            <span className="info-value">1.2M sq ft</span>
            <span className="info-label">Total Area</span>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">🚛</span>
          <div className="info-content">
            <span className="info-value">4</span>
            <span className="info-label">Loading Bays</span>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">🅿️</span>
          <div className="info-content">
            <span className="info-value">150+</span>
            <span className="info-label">Parking Spots</span>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">🚨</span>
          <div className="info-content">
            <span className="info-value">3</span>
            <span className="info-label">Emergency Exits</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarehouseExterior;
