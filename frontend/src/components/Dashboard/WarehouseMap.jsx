import { useState } from 'react';
import { warehouseZones, assetTypes } from '../../data/assets';
import './WarehouseMap.css';

function WarehouseMap({ assets, selectedAsset, onAssetSelect }) {
  const [hoveredAsset, setHoveredAsset] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'idle': return '#F59E0B';
      case 'maintenance': return '#EF4444';
      case 'offline': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <div className="warehouse-map-container">
      <div className="map-header">
        <h2>Warehouse Floor Plan</h2>
        <div className="map-legend">
          <span className="legend-item"><span className="dot active"></span> Active</span>
          <span className="legend-item"><span className="dot idle"></span> Idle</span>
          <span className="legend-item"><span className="dot maintenance"></span> Maintenance</span>
          <span className="legend-item"><span className="dot offline"></span> Offline</span>
        </div>
      </div>
      
      <div className="map-wrapper">
        <svg viewBox="0 0 700 450" className="warehouse-svg">
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#E5E7EB" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="700" height="450" fill="url(#grid)" />
          
          {/* Zones */}
          {warehouseZones.map((zone) => (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                fill={zone.color}
                fillOpacity="0.1"
                stroke={zone.color}
                strokeWidth="2"
                rx="4"
              />
              <text
                x={zone.x + 10}
                y={zone.y + 25}
                fill={zone.color}
                fontSize="14"
                fontWeight="600"
              >
                {zone.name}
              </text>
            </g>
          ))}
          
          {/* Assets */}
          {assets.map((asset) => {
            const assetType = assetTypes[asset.type];
            const isSelected = selectedAsset?.id === asset.id;
            const isHovered = hoveredAsset?.id === asset.id;
            
            return (
              <g
                key={asset.id}
                className="asset-marker"
                onClick={() => onAssetSelect(asset)}
                onMouseEnter={() => setHoveredAsset(asset)}
                onMouseLeave={() => setHoveredAsset(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse animation for active assets */}
                {asset.status === 'active' && (
                  <circle
                    cx={asset.x}
                    cy={asset.y}
                    r="20"
                    fill={getStatusColor(asset.status)}
                    opacity="0.3"
                    className="pulse-ring"
                  />
                )}
                
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={asset.x}
                    cy={asset.y}
                    r="24"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    className="selection-ring"
                  />
                )}
                
                {/* Asset circle */}
                <circle
                  cx={asset.x}
                  cy={asset.y}
                  r="16"
                  fill={isHovered || isSelected ? assetType.color : '#ffffff'}
                  stroke={getStatusColor(asset.status)}
                  strokeWidth="3"
                />
                
                {/* Asset icon */}
                <text
                  x={asset.x}
                  y={asset.y + 5}
                  textAnchor="middle"
                  fontSize="14"
                >
                  {assetType.icon}
                </text>
                
                {/* Tooltip */}
                {isHovered && (
                  <g className="tooltip">
                    <rect
                      x={asset.x - 60}
                      y={asset.y - 55}
                      width="120"
                      height="40"
                      fill="#1F2937"
                      rx="4"
                    />
                    <text
                      x={asset.x}
                      y={asset.y - 38}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {asset.name}
                    </text>
                    <text
                      x={asset.x}
                      y={asset.y - 24}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="10"
                    >
                      {asset.lastSeen}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default WarehouseMap;
