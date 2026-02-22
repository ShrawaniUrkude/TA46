import { useState, useMemo } from 'react';
import { warehouseConfig, warehouseSections, racks, products, aisles } from '../../data/warehouse';
import './HeatMap.css';

function HeatMap({ onRackClick, selectedProduct }) {
  const [viewType, setViewType] = useState('quantity'); // 'quantity', 'products', 'utilization'
  const [hoveredRack, setHoveredRack] = useState(null);

  // Calculate rack statistics
  const rackStats = useMemo(() => {
    const stats = {};
    let maxQuantity = 0;
    let maxProducts = 0;

    racks.forEach(rack => {
      const rackProducts = products.filter(p => p.rack === rack.id);
      const totalQuantity = rackProducts.reduce((sum, p) => sum + p.quantity, 0);
      const productCount = rackProducts.length;
      const avgQuantity = productCount > 0 ? totalQuantity / productCount : 0;
      const lowStockCount = rackProducts.filter(p => p.quantity < 20).length;
      
      // Estimate utilization based on quantity and capacity (assume max capacity is 500 units per rack)
      const capacity = 500;
      const utilization = (totalQuantity / capacity) * 100;

      stats[rack.id] = {
        totalQuantity,
        productCount,
        avgQuantity,
        lowStockCount,
        utilization: Math.min(utilization, 100),
        products: rackProducts,
      };

      maxQuantity = Math.max(maxQuantity, totalQuantity);
      maxProducts = Math.max(maxProducts, productCount);
    });

    return { stats, maxQuantity, maxProducts };
  }, []);

  // Get heat color based on value and type
  const getHeatColor = (rackId) => {
    const stat = rackStats.stats[rackId];
    if (!stat) return 'rgba(100, 100, 100, 0.3)';

    let intensity;
    let colorType = 'gradient'; // 'gradient' means green (good) to red (bad)

    switch (viewType) {
      case 'quantity':
        intensity = stat.totalQuantity / rackStats.maxQuantity;
        colorType = 'gradient';
        break;
      case 'products':
        intensity = stat.productCount / rackStats.maxProducts;
        colorType = 'gradient';
        break;
      case 'utilization':
        intensity = stat.utilization / 100;
        colorType = 'utilization';
        break;
      default:
        intensity = 0.5;
    }

    // Color interpolation
    if (colorType === 'gradient') {
      // Green (high stock) to Red (low stock)
      const r = Math.round(255 * (1 - intensity));
      const g = Math.round(255 * intensity);
      return `rgba(${r}, ${g}, 80, 0.85)`;
    } else {
      // Utilization: Blue to Purple to Red
      if (intensity < 0.5) {
        // Blue to Purple
        const r = Math.round(100 + 155 * (intensity * 2));
        const g = Math.round(100 * (1 - intensity * 2));
        return `rgba(${r}, ${g}, 255, 0.85)`;
      } else {
        // Purple to Red
        const r = Math.round(255);
        const g = Math.round(100 * (1 - (intensity - 0.5) * 2));
        const b = Math.round(255 * (1 - (intensity - 0.5) * 2));
        return `rgba(${r}, ${g}, ${b}, 0.85)`;
      }
    }
  };

  // Get text for legend
  const getLegendConfig = () => {
    switch (viewType) {
      case 'quantity':
        return {
          title: 'Total Stock Quantity',
          lowLabel: 'Low Stock',
          highLabel: 'High Stock',
          lowColor: 'rgb(255, 80, 80)',
          highColor: 'rgb(80, 255, 80)',
        };
      case 'products':
        return {
          title: 'Product Variety',
          lowLabel: 'Few Products',
          highLabel: 'Many Products',
          lowColor: 'rgb(255, 80, 80)',
          highColor: 'rgb(80, 255, 80)',
        };
      case 'utilization':
        return {
          title: 'Rack Utilization',
          lowLabel: 'Underutilized',
          highLabel: 'At Capacity',
          lowColor: 'rgb(100, 100, 255)',
          highColor: 'rgb(255, 80, 80)',
        };
      default:
        return {
          title: 'Value',
          lowLabel: 'Low',
          highLabel: 'High',
          lowColor: 'rgb(255, 80, 80)',
          highColor: 'rgb(80, 255, 80)',
        };
    }
  };

  const legendConfig = getLegendConfig();

  return (
    <div className="heatmap-container">
      <div className="heatmap-controls">
        <div className="view-type-selector">
          <span className="selector-label">View:</span>
          <button
            className={viewType === 'quantity' ? 'active' : ''}
            onClick={() => setViewType('quantity')}
          >
            📦 Stock Quantity
          </button>
          <button
            className={viewType === 'products' ? 'active' : ''}
            onClick={() => setViewType('products')}
          >
            🏷️ Product Count
          </button>
          <button
            className={viewType === 'utilization' ? 'active' : ''}
            onClick={() => setViewType('utilization')}
          >
            📊 Utilization
          </button>
        </div>
      </div>

      <div className="heatmap-main">
        <svg
          viewBox={`0 0 ${warehouseConfig.width} ${warehouseConfig.height}`}
          className="heatmap-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect x="0" y="0" width={warehouseConfig.width} height={warehouseConfig.height} fill="#1a1a2e" />

          {/* Grid pattern */}
          <defs>
            <pattern id="heatmapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x="0" y="0" width={warehouseConfig.width} height={warehouseConfig.height} fill="url(#heatmapGrid)" />

          {/* Sections */}
          {warehouseSections.map(section => (
            <g key={section.id}>
              <rect
                x={section.x}
                y={section.y}
                width={section.width}
                height={section.height}
                fill={section.color}
                fillOpacity="0.2"
                stroke={section.color}
                strokeWidth="2"
              />
              <text
                x={section.x + section.width / 2}
                y={section.y + section.height / 2}
                fill="#ffffff"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {section.name}
              </text>
            </g>
          ))}

          {/* Aisles */}
          {aisles.map(aisle => (
            <rect
              key={aisle.id}
              x={aisle.x}
              y={aisle.y}
              width={aisle.width}
              height={aisle.height}
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="5,5"
            />
          ))}

          {/* Heat Map Racks */}
          {racks.map(rack => {
            const isHovered = hoveredRack === rack.id;
            const isSelected = selectedProduct?.rack === rack.id;
            const stat = rackStats.stats[rack.id];
            const heatColor = getHeatColor(rack.id);

            return (
              <g
                key={rack.id}
                className="heatmap-rack"
                onMouseEnter={() => setHoveredRack(rack.id)}
                onMouseLeave={() => setHoveredRack(null)}
                onClick={() => onRackClick?.({ id: rack.id, ...rack })}
                style={{ cursor: 'pointer' }}
              >
                {/* Rack background with heat color */}
                <rect
                  x={rack.x}
                  y={rack.y}
                  width={rack.width}
                  height={rack.height}
                  fill={heatColor}
                  stroke={isSelected ? '#fff' : isHovered ? '#60a5fa' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                  rx="4"
                  ry="4"
                />

                {/* Rack ID */}
                <text
                  x={rack.x + rack.width / 2}
                  y={rack.y + rack.height / 2 - 8}
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                >
                  {rack.id}
                </text>

                {/* Value display */}
                <text
                  x={rack.x + rack.width / 2}
                  y={rack.y + rack.height / 2 + 10}
                  fill="#ffffff"
                  fontSize="11"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {viewType === 'quantity' && `${stat?.totalQuantity || 0} units`}
                  {viewType === 'products' && `${stat?.productCount || 0} items`}
                  {viewType === 'utilization' && `${Math.round(stat?.utilization || 0)}%`}
                </text>

                {/* Low stock warning indicator */}
                {stat?.lowStockCount > 0 && viewType === 'quantity' && (
                  <g>
                    <circle
                      cx={rack.x + rack.width - 10}
                      cy={rack.y + 10}
                      r="8"
                      fill="#ef4444"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <text
                      x={rack.x + rack.width - 10}
                      y={rack.y + 10}
                      fill="#fff"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {stat.lowStockCount}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredRack && (
          <div className="heatmap-tooltip">
            <div className="tooltip-header">
              <span className="tooltip-rack-id">{hoveredRack}</span>
              <span className="tooltip-category">{racks.find(r => r.id === hoveredRack)?.category}</span>
            </div>
            <div className="tooltip-stats">
              <div className="tooltip-stat">
                <span className="stat-icon">📦</span>
                <span className="stat-value">{rackStats.stats[hoveredRack]?.totalQuantity || 0}</span>
                <span className="stat-label">Total Units</span>
              </div>
              <div className="tooltip-stat">
                <span className="stat-icon">🏷️</span>
                <span className="stat-value">{rackStats.stats[hoveredRack]?.productCount || 0}</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="tooltip-stat">
                <span className="stat-icon">📊</span>
                <span className="stat-value">{Math.round(rackStats.stats[hoveredRack]?.utilization || 0)}%</span>
                <span className="stat-label">Utilization</span>
              </div>
              {rackStats.stats[hoveredRack]?.lowStockCount > 0 && (
                <div className="tooltip-stat warning">
                  <span className="stat-icon">⚠️</span>
                  <span className="stat-value">{rackStats.stats[hoveredRack]?.lowStockCount}</span>
                  <span className="stat-label">Low Stock Items</span>
                </div>
              )}
            </div>
            <div className="tooltip-products">
              <span className="products-title">Products:</span>
              {rackStats.stats[hoveredRack]?.products?.map(p => (
                <div key={p.id} className={`product-item ${p.quantity < 20 ? 'low-stock' : ''}`}>
                  <span className="product-name">{p.name}</span>
                  <span className="product-qty">{p.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="heatmap-legend">
        <div className="legend-title">{legendConfig.title}</div>
        <div className="legend-bar">
          <div 
            className="legend-gradient"
            style={{
              background: `linear-gradient(to right, ${legendConfig.lowColor}, ${legendConfig.highColor})`
            }}
          ></div>
          <div className="legend-labels">
            <span>{legendConfig.lowLabel}</span>
            <span>{legendConfig.highLabel}</span>
          </div>
        </div>
        {viewType === 'quantity' && (
          <div className="legend-warning">
            <span className="warning-dot"></span>
            <span>Badge shows items with low stock (&lt;20 units)</span>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="heatmap-summary">
        <div className="summary-card">
          <div className="summary-icon">📦</div>
          <div className="summary-content">
            <span className="summary-value">
              {Object.values(rackStats.stats).reduce((sum, s) => sum + s.totalQuantity, 0).toLocaleString()}
            </span>
            <span className="summary-label">Total Units</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">🗄️</div>
          <div className="summary-content">
            <span className="summary-value">{racks.length}</span>
            <span className="summary-label">Racks</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <span className="summary-value">
              {Math.round(Object.values(rackStats.stats).reduce((sum, s) => sum + s.utilization, 0) / racks.length)}%
            </span>
            <span className="summary-label">Avg Utilization</span>
          </div>
        </div>
        <div className="summary-card warning">
          <div className="summary-icon">⚠️</div>
          <div className="summary-content">
            <span className="summary-value">
              {Object.values(rackStats.stats).reduce((sum, s) => sum + s.lowStockCount, 0)}
            </span>
            <span className="summary-label">Low Stock Items</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeatMap;
