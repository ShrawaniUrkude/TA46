import { useState, useMemo } from 'react';
import { products } from '../data/warehouse';
import './AIAssistant.css';

export function AIAssistant({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('insights');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Analysis: Predict out-of-stock products
  const analyzedData = useMemo(() => {
    const outOfStock = products.filter(p => p.quantity === 0);
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 20);
    const mediumStock = products.filter(p => p.quantity > 20 && p.quantity <= 100);
    const highStock = products.filter(p => p.quantity > 100);

    // Risk prediction: Products that will run out soon
    const riskProducts = lowStock.sort((a, b) => a.quantity - b.quantity);

    // Category analysis
    const categoryStats = {};
    products.forEach(p => {
      if (!categoryStats[p.category]) {
        categoryStats[p.category] = {
          total: 0,
          count: 0,
          outOfStock: 0,
          lowStock: 0,
        };
      }
      categoryStats[p.category].count += 1;
      categoryStats[p.category].total += p.quantity;
      if (p.quantity === 0) categoryStats[p.category].outOfStock += 1;
      if (p.quantity > 0 && p.quantity <= 20) categoryStats[p.category].lowStock += 1;
    });

    return {
      outOfStock,
      lowStock,
      mediumStock,
      highStock,
      riskProducts,
      categoryStats,
      totalProducts: products.length,
      totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
    };
  }, []);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getRiskLevel = (quantity) => {
    if (quantity === 0) return { level: 'Critical', color: '#EF4444', icon: '🔴' };
    if (quantity <= 10) return { level: 'Critical', color: '#EF4444', icon: '🔴' };
    if (quantity <= 20) return { level: 'Warning', color: '#F59E0B', icon: '🟡' };
    if (quantity <= 50) return { level: 'Low', color: '#3B82F6', icon: '🔵' };
    return { level: 'Healthy', color: '#10B981', icon: '🟢' };
  };

  if (!isOpen) return null;

  return (
    <div className="ai-assistant-overlay" onClick={onClose}>
      <div className="ai-assistant-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-header">
          <div className="ai-title">
            <span className="ai-icon">🤖</span>
            <h2>AI Smart Assistant</h2>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Tab Navigation */}
        <div className="ai-tabs">
          <button
            className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            📊 Insights
          </button>
          <button
            className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            ⚠️ Low Stock ({analyzedData.lowStock.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Products
          </button>
        </div>

        {/* Content Area */}
        <div className="ai-content">
          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="insights-section">
              <div className="ai-summary">
                <div className="summary-stat">
                  <span className="stat-icon">📦</span>
                  <div className="stat-info">
                    <span className="stat-label">Total Products</span>
                    <span className="stat-value">{analyzedData.totalProducts}</span>
                  </div>
                </div>
                <div className="summary-stat">
                  <span className="stat-icon">📊</span>
                  <div className="stat-info">
                    <span className="stat-label">Total Quantity</span>
                    <span className="stat-value">{analyzedData.totalQuantity.toLocaleString()}</span>
                  </div>
                </div>
                <div className="summary-stat">
                  <span className="stat-icon">🟢</span>
                  <div className="stat-info">
                    <span className="stat-label">Healthy Stock</span>
                    <span className="stat-value">{analyzedData.highStock.length}</span>
                  </div>
                </div>
                <div className="summary-stat warning">
                  <span className="stat-icon">🟡</span>
                  <div className="stat-info">
                    <span className="stat-label">Low Stock</span>
                    <span className="stat-value">{analyzedData.lowStock.length}</span>
                  </div>
                </div>
                <div className="summary-stat critical">
                  <span className="stat-icon">🔴</span>
                  <div className="stat-info">
                    <span className="stat-label">Out of Stock</span>
                    <span className="stat-value">{analyzedData.outOfStock.length}</span>
                  </div>
                </div>
              </div>

              {/* Stock Distribution */}
              <div className="stock-distribution">
                <h3>📈 Stock Distribution</h3>
                <div className="distribution-bars">
                  <div className="bar-item">
                    <div className="bar-label">
                      <span>High Stock (&gt;100)</span>
                      <span className="bar-count">{analyzedData.highStock.length}</span>
                    </div>
                    <div className="bar-container">
                      <div
                        className="bar"
                        style={{
                          width: `${(analyzedData.highStock.length / analyzedData.totalProducts) * 100}%`,
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        }}
                      />
                    </div>
                  </div>
                  <div className="bar-item">
                    <div className="bar-label">
                      <span>Medium Stock (20-100)</span>
                      <span className="bar-count">{analyzedData.mediumStock.length}</span>
                    </div>
                    <div className="bar-container">
                      <div
                        className="bar"
                        style={{
                          width: `${(analyzedData.mediumStock.length / analyzedData.totalProducts) * 100}%`,
                          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        }}
                      />
                    </div>
                  </div>
                  <div className="bar-item">
                    <div className="bar-label">
                      <span>Low Stock (1-20)</span>
                      <span className="bar-count">{analyzedData.lowStock.length}</span>
                    </div>
                    <div className="bar-container">
                      <div
                        className="bar"
                        style={{
                          width: `${(analyzedData.lowStock.length / analyzedData.totalProducts) * 100}%`,
                          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        }}
                      />
                    </div>
                  </div>
                  <div className="bar-item">
                    <div className="bar-label">
                      <span>Out of Stock</span>
                      <span className="bar-count">{analyzedData.outOfStock.length}</span>
                    </div>
                    <div className="bar-container">
                      <div
                        className="bar"
                        style={{
                          width: `${(analyzedData.outOfStock.length / analyzedData.totalProducts) * 100}%`,
                          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Performance */}
              <div className="category-performance">
                <h3>📂 Category Performance</h3>
                <div className="category-list">
                  {Object.entries(analyzedData.categoryStats).map(([category, stats]) => (
                    <div key={category} className="category-item">
                      <div className="category-header">
                        <span className="category-name">{category}</span>
                        <span className="category-count">{stats.count} items</span>
                      </div>
                      <div className="category-metrics">
                        <div className="metric">
                          <span className="metric-label">Total Qty</span>
                          <span className="metric-value">{stats.total}</span>
                        </div>
                        <div className="metric warning">
                          <span className="metric-label">Low Stock</span>
                          <span className="metric-value">{stats.lowStock}</span>
                        </div>
                        <div className="metric critical">
                          <span className="metric-label">Out Stock</span>
                          <span className="metric-value">{stats.outOfStock}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Alerts Tab - Low Stock Products */}
          {activeTab === 'alerts' && (
            <div className="alerts-section">
              {analyzedData.riskProducts.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">✅</span>
                  <p>All products have healthy stock levels!</p>
                </div>
              ) : (
                <div className="alert-list">
                  <div className="alert-header-info">
                    <p>⚠️ These products need attention and may run out soon</p>
                  </div>
                  {analyzedData.riskProducts.map((product) => {
                    const riskLevel = getRiskLevel(product.quantity);
                    return (
                      <div key={product.id} className="alert-item">
                        <div className="alert-left">
                          <span className="risk-icon">{riskLevel.icon}</span>
                          <div className="product-details">
                            <span className="product-name">{product.name}</span>
                            <span className="product-sku">SKU: {product.id}</span>
                            <span className="product-location">
                              📍 Rack {product.rack}, Shelf {product.shelf}
                            </span>
                          </div>
                        </div>
                        <div className="alert-right">
                          <div className="quantity-box">
                            <span style={{ color: riskLevel.color }}>
                              {product.quantity}
                            </span>
                            <span className="qty-label">units</span>
                          </div>
                          <span className="risk-label" style={{ color: riskLevel.color }}>
                            {riskLevel.level}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Products Tab - Search and List */}
          {activeTab === 'products' && (
            <div className="products-section">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, SKU, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🔍</span>
                  <p>No products found matching your search</p>
                </div>
              ) : (
                <div className="products-list">
                  <div className="results-count">
                    Showing {filteredProducts.length} of {products.length} products
                  </div>
                  {filteredProducts.map((product) => {
                    const riskLevel = getRiskLevel(product.quantity);
                    return (
                      <div key={product.id} className="product-item">
                        <div className="product-left">
                          <span className="product-risk-icon">{riskLevel.icon}</span>
                          <div className="product-info">
                            <span className="product-title">{product.name}</span>
                            <div className="product-meta">
                              <span className="product-id">{product.id}</span>
                              <span className="product-cat">{product.category}</span>
                            </div>
                            <span className="product-loc">
                              📍 Rack {product.rack}, Shelf {product.shelf}
                            </span>
                          </div>
                        </div>
                        <div className="product-right">
                          <div className="qty-display">
                            <span className="qty" style={{ color: riskLevel.color }}>
                              {product.quantity}
                            </span>
                            <span className="qty-unit">pcs</span>
                          </div>
                          <span className="status-badge" style={{ color: riskLevel.color, borderColor: riskLevel.color }}>
                            {riskLevel.level}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Tips Footer */}
        <div className="ai-footer">
          <div className="ai-tip">
            💡 <strong>AI Tip:</strong> Products with quantity ≤20 need reordering. Categories with low stock should be reviewed.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
