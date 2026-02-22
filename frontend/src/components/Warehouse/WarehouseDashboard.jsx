import { useState, useCallback, useEffect } from 'react';
import { warehouseConfig, products, racks, categoryColors } from '../../data/warehouse';
import { findShortestPath } from '../../utils/pathfinding';
import { WarehouseFloorPlan, ProductSearch, PathGuide, Warehouse3D, WarehouseExterior, HeatMap } from '../Warehouse';
import './WarehouseDashboard.css';

function WarehouseDashboard() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [path, setPath] = useState([]);
  const [workerPosition, setWorkerPosition] = useState(warehouseConfig.workerStart);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [viewMode, setViewMode] = useState('exterior'); // 'exterior', '2d' or '3d'

  // Calculate path when product is selected
  useEffect(() => {
    if (selectedProduct) {
      const newPath = findShortestPath(
        workerPosition.x,
        workerPosition.y,
        selectedProduct.x,
        selectedProduct.y
      );
      setPath(newPath);
    } else {
      setPath([]);
    }
  }, [selectedProduct, workerPosition]);

  const handleProductSelect = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  const handleClearPath = useCallback(() => {
    setSelectedProduct(null);
    setPath([]);
    setWorkerPosition(warehouseConfig.workerStart);
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

        {/* Right Panel - Path Guide (Desktop) */}
        <div className="right-panel">
          <PathGuide
            path={path}
            selectedProduct={selectedProduct}
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
