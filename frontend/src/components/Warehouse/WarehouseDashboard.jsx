import { useState, useCallback, useEffect } from 'react';
import { warehouseConfig, products, racks, categoryColors } from '../../data/warehouse';
import { findShortestPath } from '../../utils/pathfinding';
import { WarehouseFloorPlan, ProductSearch, PathGuide, Warehouse3D, WarehouseExterior, HeatMap, ToolSelector } from '../Warehouse';
import './WarehouseDashboard.css';

function WarehouseDashboard() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [path, setPath] = useState([]);
  const [workerPosition, setWorkerPosition] = useState(warehouseConfig.workerStart);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [viewMode, setViewMode] = useState('exterior'); // 'exterior', '2d' or '3d'
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [selectedTools, setSelectedTools] = useState([]);
  const [pendingProduct, setPendingProduct] = useState(null);

  // Calculate path with tool stops when tools are confirmed
  const calculatePathWithTools = useCallback((product, tools) => {
    if (!product) return [];
    
    let currentX = workerPosition.x;
    let currentY = workerPosition.y;
    let fullPath = [];

    // Sort tools by distance from worker for optimal pickup order
    const sortedTools = [...tools].sort((a, b) => {
      const distA = Math.sqrt(Math.pow(a.x - currentX, 2) + Math.pow(a.y - currentY, 2));
      const distB = Math.sqrt(Math.pow(b.x - currentX, 2) + Math.pow(b.y - currentY, 2));
      return distA - distB;
    });

    // Calculate path through each tool pickup point
    sortedTools.forEach(tool => {
      const pathToTool = findShortestPath(currentX, currentY, tool.x, tool.y);
      if (pathToTool.length > 0) {
        // Skip first point if it overlaps with previous path end
        const startIndex = fullPath.length > 0 ? 1 : 0;
        fullPath = [...fullPath, ...pathToTool.slice(startIndex)];
        currentX = tool.x;
        currentY = tool.y;
      }
    });

    // Finally, path to product
    const pathToProduct = findShortestPath(currentX, currentY, product.x, product.y);
    if (pathToProduct.length > 0) {
      const startIndex = fullPath.length > 0 ? 1 : 0;
      fullPath = [...fullPath, ...pathToProduct.slice(startIndex)];
    }

    return fullPath;
  }, [workerPosition]);

  // Handle tool selection confirmation
  const handleToolConfirm = useCallback((tools) => {
    setSelectedTools(tools);
    setShowToolSelector(false);
    
    if (pendingProduct) {
      setSelectedProduct(pendingProduct);
      
      // Calculate path with tool stops
      const newPath = tools.length > 0 
        ? calculatePathWithTools(pendingProduct, tools)
        : findShortestPath(workerPosition.x, workerPosition.y, pendingProduct.x, pendingProduct.y);
      
      setPath(newPath);
      setPendingProduct(null);
    }
  }, [pendingProduct, calculatePathWithTools, workerPosition]);

  const handleProductSelect = useCallback((product) => {
    if (product) {
      // Show tool selector before proceeding
      setPendingProduct(product);
      setShowToolSelector(true);
    } else {
      setSelectedProduct(null);
      setPath([]);
    }
  }, []);

  const handleClearPath = useCallback(() => {
    setSelectedProduct(null);
    setPath([]);
    setWorkerPosition(warehouseConfig.workerStart);
    setSelectedTools([]);
    setPendingProduct(null);
  }, []);

  const handleStartNavigation = useCallback(() => {
    if (path.length < 2) return;
    
    setIsAnimating(true);
    let currentIndex = 0;
    
    const animateWorker = () => {
      if (currentIndex < path.length) {
        setWorkerPosition(path[currentIndex]);
        currentIndex++;
        setTimeout(animateWorker, 300);
      } else {
        setIsAnimating(false);
      }
    };
    
    animateWorker();
  }, [path]);

  const handleRackClick = useCallback((rack) => {
    // Find first product in this rack
    const rackProducts = products.filter(p => p.rack === rack.id);
    if (rackProducts.length > 0) {
      setSelectedProduct(rackProducts[0]);
    }
  }, []);

  // Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockItems = products.filter(p => p.quantity < 20).length;
  const categories = Object.keys(categoryColors).length;

  return (
    <div className="warehouse-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>📦 Amazon-Style Warehouse</h1>
          <p>Indoor Asset & Product Tracking System</p>
        </div>
        <div className="header-stats">
          <div className="mini-stat">
            <span className="stat-value">{totalProducts}</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="mini-stat">
            <span className="stat-value">{totalStock.toLocaleString()}</span>
            <span className="stat-label">Total Stock</span>
          </div>
          <div className="mini-stat warning">
            <span className="stat-value">{lowStockItems}</span>
            <span className="stat-label">Low Stock</span>
          </div>
          <div className="mini-stat">
            <span className="stat-value">{categories}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          className={`view-btn ${viewMode === 'exterior' ? 'active' : ''}`}
          onClick={() => setViewMode('exterior')}
        >
          <span>🗺️</span> Facility Map
        </button>
        <button
          className={`view-btn ${viewMode === '2d' ? 'active' : ''}`}
          onClick={() => setViewMode('2d')}
        >
          <span>📋</span> 2D Floor Plan
        </button>
        <button
          className={`view-btn ${viewMode === '3d' ? 'active' : ''}`}
          onClick={() => setViewMode('3d')}
        >
          <span>🎮</span> 3D Warehouse
        </button>
        <button
          className={`view-btn ${viewMode === 'heatmap' ? 'active' : ''}`}
          onClick={() => setViewMode('heatmap')}
        >
          <span>🗺️</span> Heat Map
        </button>
      </div>

      <div className="dashboard-layout">
        {/* Left Panel - Search & Guide */}
        <div className="left-panel">
          <div className="panel-tabs">
            <button 
              className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              🔍 Search Products
            </button>
            <button 
              className={`tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
              onClick={() => setActiveTab('guide')}
            >
              🧭 Navigation
            </button>
          </div>

          <div className="panel-content">
            {activeTab === 'search' ? (
              <ProductSearch
                onProductSelect={handleProductSelect}
                selectedProduct={selectedProduct}
              />
            ) : (
              <PathGuide
                path={path}
                selectedProduct={selectedProduct}
                selectedTools={selectedTools}
                onStartNavigation={handleStartNavigation}
                onClearPath={handleClearPath}
              />
            )}
          </div>
        </div>

        {/* Main Area - Exterior, Floor Plan or 3D View */}
        <div className="main-panel">
          {viewMode === 'exterior' ? (
            <WarehouseExterior onEnterWarehouse={() => setViewMode('2d')} />
          ) : viewMode === '2d' ? (
            <WarehouseFloorPlan
              selectedProduct={selectedProduct}
              path={path}
              workerPosition={workerPosition}
              onRackClick={handleRackClick}
              animatingWorker={isAnimating}
            />
          ) : viewMode === 'heatmap' ? (
            <HeatMap
              selectedProduct={selectedProduct}
              onRackClick={handleRackClick}
            />
          ) : (
            <Warehouse3D
              selectedProduct={selectedProduct}
              path={path}
              workerPosition={workerPosition}
              onProductSelect={handleProductSelect}
            />
          )}

          {/* Quick action bar */}
          {selectedProduct && (
            <div className="quick-actions">
              <div className="selected-info">
                <span>📍 Selected: <strong>{selectedProduct.name}</strong></span>
                <span className="rack-info">Rack {selectedProduct.rack} • Shelf {selectedProduct.shelf}</span>
                {selectedTools.length > 0 && (
                  <span className="tools-info">
                    🧰 Tools: {selectedTools.map(t => t.icon).join(' ')}
                  </span>
                )}
              </div>
              <div className="action-buttons">
                <button 
                  className="action-btn primary"
                  onClick={() => setActiveTab('guide')}
                >
                  View Directions
                </button>
                <button 
                  className="action-btn success"
                  onClick={handleStartNavigation}
                  disabled={isAnimating}
                >
                  {isAnimating ? 'Navigating...' : '🚀 Start Navigation'}
                </button>
                <button 
                  className="action-btn danger"
                  onClick={handleClearPath}
                >
                  ✕ Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tool Selector Modal */}
        <ToolSelector
          isOpen={showToolSelector}
          onClose={() => {
            setShowToolSelector(false);
            setPendingProduct(null);
          }}
          onConfirm={handleToolConfirm}
          selectedProduct={pendingProduct}
          workerPosition={workerPosition}
        />

        {/* Right Panel - Path Guide (Desktop) */}
        <div className="right-panel">
          <PathGuide
            path={path}
            selectedProduct={selectedProduct}
            selectedTools={selectedTools}
            onStartNavigation={handleStartNavigation}
            onClearPath={handleClearPath}
          />
        </div>
      </div>

      {/* Products by Rack Section */}
      <div className="rack-overview">
        <h2>📊 Rack Overview</h2>
        <div className="rack-grid">
          {racks.map(rack => {
            const rackProducts = products.filter(p => p.rack === rack.id);
            const totalQty = rackProducts.reduce((sum, p) => sum + p.quantity, 0);
            
            return (
              <div 
                key={rack.id} 
                className={`rack-card ${selectedProduct?.rack === rack.id ? 'selected' : ''}`}
                onClick={() => handleRackClick(rack)}
                style={{ borderColor: rack.color }}
              >
                <div className="rack-header" style={{ backgroundColor: rack.color }}>
                  <span className="rack-id">{rack.id}</span>
                  <span className="rack-category">{rack.category}</span>
                </div>
                <div className="rack-body">
                  <div className="rack-stat">
                    <span className="value">{rackProducts.length}</span>
                    <span className="label">Products</span>
                  </div>
                  <div className="rack-stat">
                    <span className="value">{totalQty}</span>
                    <span className="label">Total Units</span>
                  </div>
                </div>
                <div className="rack-products-list">
                  <div className="products-header">
                    <span>Product</span>
                    <span>Qty</span>
                  </div>
                  {rackProducts.map(p => (
                    <div 
                      key={p.id} 
                      className={`product-row ${selectedProduct?.id === p.id ? 'selected' : ''} ${p.quantity < 20 ? 'low-stock' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductSelect(p);
                      }}
                    >
                      <span className="product-name">{p.name}</span>
                      <span className={`product-qty ${p.quantity < 20 ? 'warning' : ''}`}>
                        {p.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WarehouseDashboard;
