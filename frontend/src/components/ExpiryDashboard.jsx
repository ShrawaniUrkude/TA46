import { useState, useMemo, useEffect } from 'react'
import './ExpiryDashboard.css'

function ExpiryDashboard({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('expiring')
  const [autoNotify, setAutoNotify] = useState(true)

  // Mock expiry data
  const [products] = useState([
    {
      id: 1,
      name: 'Organic Milk (1L)',
      sku: 'DY-001',
      category: 'Dairy',
      quantity: 150,
      expiryDate: '2026-02-24',
      daysLeft: 2,
      location: 'Rack C-1',
      priority: 'critical',
      value: 450,
      recyclable: true,
      recycleType: 'compost',
      packaging: 'Tetra Pak'
    },
    {
      id: 2,
      name: 'Greek Yogurt Pack',
      sku: 'DY-002',
      category: 'Dairy',
      quantity: 80,
      expiryDate: '2026-02-25',
      daysLeft: 3,
      location: 'Rack C-2',
      priority: 'critical',
      value: 320,
      recyclable: true,
      recycleType: 'compost',
      packaging: 'Plastic Container'
    },
    {
      id: 3,
      name: 'Fresh Bread Loaves',
      sku: 'BK-001',
      category: 'Bakery',
      quantity: 45,
      expiryDate: '2026-02-26',
      daysLeft: 4,
      location: 'Rack B-1',
      priority: 'high',
      value: 135,
      recyclable: true,
      recycleType: 'compost',
      packaging: 'Paper Bag'
    },
    {
      id: 4,
      name: 'Chicken Breast (Frozen)',
      sku: 'MT-001',
      category: 'Meat',
      quantity: 200,
      expiryDate: '2026-02-28',
      daysLeft: 6,
      location: 'Rack F-3',
      priority: 'high',
      value: 1200,
      recyclable: false,
      recycleType: 'dispose',
      packaging: 'Vacuum Sealed'
    },
    {
      id: 5,
      name: 'Fresh Salad Mix',
      sku: 'VG-001',
      category: 'Vegetables',
      quantity: 60,
      expiryDate: '2026-02-27',
      daysLeft: 5,
      location: 'Rack V-2',
      priority: 'high',
      value: 180,
      recyclable: true,
      recycleType: 'compost',
      packaging: 'Plastic Clamshell'
    },
    {
      id: 6,
      name: 'Orange Juice (2L)',
      sku: 'BV-001',
      category: 'Beverages',
      quantity: 120,
      expiryDate: '2026-03-05',
      daysLeft: 11,
      location: 'Rack D-1',
      priority: 'medium',
      value: 360,
      recyclable: true,
      recycleType: 'recycle',
      packaging: 'PET Bottle'
    },
    {
      id: 7,
      name: 'Cheddar Cheese Block',
      sku: 'DY-003',
      category: 'Dairy',
      quantity: 35,
      expiryDate: '2026-03-08',
      daysLeft: 14,
      location: 'Rack C-3',
      priority: 'medium',
      value: 280,
      recyclable: true,
      recycleType: 'compost',
      packaging: 'Wax Paper'
    },
    {
      id: 8,
      name: 'Protein Bars (Box)',
      sku: 'SN-001',
      category: 'Snacks',
      quantity: 90,
      expiryDate: '2026-03-15',
      daysLeft: 21,
      location: 'Rack S-1',
      priority: 'low',
      value: 450,
      recyclable: true,
      recycleType: 'recycle',
      packaging: 'Cardboard Box'
    }
  ])

  // Priority usage suggestions based on expiry
  const usageSuggestions = useMemo(() => {
    return products
      .filter(p => p.daysLeft <= 7)
      .map(p => ({
        ...p,
        suggestion: p.daysLeft <= 2 
          ? 'FLASH SALE - 50% off recommended' 
          : p.daysLeft <= 4 
            ? 'Bundle with other products for quick sale'
            : 'Move to front displays for visibility',
        action: p.daysLeft <= 2 ? 'urgent' : p.daysLeft <= 4 ? 'priority' : 'normal'
      }))
  }, [products])
  // Recycle/Dispose recommendations
  const recycleRecommendations = useMemo(() => {
    return products
      .filter(p => p.daysLeft <= 7)
      .map(p => ({
        ...p,
        disposalMethod: p.recycleType === 'compost' 
          ? 'Organic Composting' 
          : p.recycleType === 'recycle' 
            ? 'Packaging Recycling'
            : 'Safe Disposal',
        disposalPartner: p.recycleType === 'compost'
          ? 'Green Earth Composting'
          : p.recycleType === 'recycle'
            ? 'EcoRecycle Partners'
            : 'Certified Waste Management',
        envImpact: p.recyclable ? 'Low Carbon' : 'Standard',
        processingCost: Math.round(p.value * 0.05)
      }))
  }, [products])
  // Analysis stats
  const stats = useMemo(() => {
    const critical = products.filter(p => p.priority === 'critical').length
    const high = products.filter(p => p.priority === 'high').length
    const totalValue = products.filter(p => p.daysLeft <= 7).reduce((sum, p) => sum + p.value, 0)
    const expiringThisWeek = products.filter(p => p.daysLeft <= 7).length

    return { critical, high, totalValue, expiringThisWeek }
  }, [products])

  // Filter products based on active tab
  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case 'expiring':
        return products.filter(p => p.daysLeft <= 14).sort((a, b) => a.daysLeft - b.daysLeft)
      case 'critical':
        return products.filter(p => p.priority === 'critical' || p.priority === 'high')
      case 'suggestions':
        return usageSuggestions
      case 'recycle':
        return recycleRecommendations
      default:
        return products
    }
  }, [products, activeTab, usageSuggestions, recycleRecommendations])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#EF4444'
      case 'high': return '#F59E0B'
      case 'medium': return '#3B82F6'
      case 'low': return '#10B981'
      default: return '#6B7280'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return '🔴'
      case 'high': return '🟠'
      case 'medium': return '🔵'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Dairy': '🥛',
      'Bakery': '🍞',
      'Meat': '🍖',
      'Vegetables': '🥬',
      'Beverages': '🧃',
      'Snacks': '🍫'
    }
    return icons[category] || '📦'
  }

  // Auto-notification simulation
  useEffect(() => {
    if (autoNotify && isOpen) {
      const criticalItems = products.filter(p => p.daysLeft <= 2)
      if (criticalItems.length > 0) {
        // In real app, this would trigger actual notifications
        console.log(`⚠️ Auto-notification: ${criticalItems.length} items expiring within 48 hours!`)
      }
    }
  }, [autoNotify, isOpen, products])

  if (!isOpen) return null

  return (
    <div className="expiry-dashboard-overlay">
      <div className="expiry-dashboard-panel">
        {/* Header */}
        <div className="expiry-header">
          <div className="expiry-title-section">
            <span className="expiry-icon">⏰</span>
            <div>
              <h2 className="expiry-title">Expiry Dashboard</h2>
              <p className="expiry-subtitle">Product expiration management & waste reduction</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="auto-notify-toggle">
              <span>Auto-Notify</span>
              <button 
                className={`toggle-switch ${autoNotify ? 'active' : ''}`}
                onClick={() => setAutoNotify(!autoNotify)}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="expiry-stats-grid">
          <div className="expiry-stat-card critical-stat">
            <div className="stat-icon-wrapper critical">🚨</div>
            <div className="stat-content">
              <div className="stat-number">{stats.critical}</div>
              <div className="stat-label">Critical (48h)</div>
            </div>
          </div>
          <div className="expiry-stat-card warning-stat">
            <div className="stat-icon-wrapper warning">⚠️</div>
            <div className="stat-content">
              <div className="stat-number">{stats.high}</div>
              <div className="stat-label">High Priority</div>
            </div>
          </div>
          <div className="expiry-stat-card value-stat">
            <div className="stat-icon-wrapper value">💰</div>
            <div className="stat-content">
              <div className="stat-number">₹{stats.totalValue}</div>
              <div className="stat-label">At Risk Value</div>
            </div>
          </div>
          <div className="expiry-stat-card week-stat">
            <div className="stat-icon-wrapper week">📅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.expiringThisWeek}</div>
              <div className="stat-label">This Week</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="expiry-tabs">
          <button 
            className={`expiry-tab ${activeTab === 'expiring' ? 'active' : ''}`}
            onClick={() => setActiveTab('expiring')}
          >
            <span>⏰</span> Expiring Soon
          </button>
          <button 
            className={`expiry-tab ${activeTab === 'critical' ? 'active' : ''}`}
            onClick={() => setActiveTab('critical')}
          >
            <span>🚨</span> Critical Alerts
          </button>
          <button 
            className={`expiry-tab ${activeTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            <span>💡</span> Usage Tips
          </button>
          <button 
            className={`expiry-tab ${activeTab === 'recycle' ? 'active' : ''}`}
            onClick={() => setActiveTab('recycle')}
          >
            <span>♻️</span> Recycle/Dispose
          </button>
        </div>

        {/* Content */}
        <div className="expiry-content">
          {activeTab === 'expiring' || activeTab === 'critical' ? (
            <div className="expiry-list">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className={`expiry-item priority-${product.priority}`}
                >
                  <div className="expiry-item-left">
                    <span className="category-icon">{getCategoryIcon(product.category)}</span>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="product-meta">
                        SKU: {product.sku} • {product.location} • {product.quantity} units
                      </p>
                    </div>
                  </div>
                  <div className="expiry-item-right">
                    <div className="days-badge" style={{ backgroundColor: getPriorityColor(product.priority) }}>
                      {product.daysLeft <= 0 ? 'EXPIRED' : `${product.daysLeft} days`}
                    </div>
                    <div className="expiry-date">
                      <span className="priority-indicator">{getPriorityIcon(product.priority)}</span>
                      {product.expiryDate}
                    </div>
                    <div className="product-value">₹{product.value}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'suggestions' ? (
            <div className="suggestions-list">
              <div className="suggestions-header">
                <h3>🎯 Priority Usage Suggestions</h3>
                <p>AI-powered recommendations to minimize waste</p>
              </div>
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className={`suggestion-card action-${product.action}`}
                >
                  <div className="suggestion-product">
                    <span className="category-icon">{getCategoryIcon(product.category)}</span>
                    <div>
                      <h4>{product.name}</h4>
                      <p>{product.quantity} units • Expires in {product.daysLeft} days</p>
                    </div>
                  </div>
                  <div className="suggestion-content">
                    <div className="suggestion-badge">
                      {product.action === 'urgent' ? '🔥 URGENT' : product.action === 'priority' ? '⚡ PRIORITY' : '📌 RECOMMENDED'}
                    </div>
                    <p className="suggestion-text">{product.suggestion}</p>
                  </div>
                  <div className="suggestion-actions">
                    <button className="action-btn primary">Apply Discount</button>
                    <button className="action-btn secondary">Create Bundle</button>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'recycle' ? (
            <div className="recycle-list">
              <div className="recycle-header">
                <h3>♻️ Recycle & Dispose Options</h3>
                <p>Eco-friendly disposal methods for expired or expiring products</p>
              </div>
              {filteredProducts.map(product => (
                <div key={product.id} className={`recycle-card ${product.recycleType}`}>
                  <div className="recycle-product">
                    <span className="category-icon large">{getCategoryIcon(product.category)}</span>
                    <div className="recycle-product-info">
                      <h4>{product.name}</h4>
                      <p>{product.quantity} units • Expires {product.expiryDate}</p>
                      <span className="packaging-tag">📦 {product.packaging}</span>
                    </div>
                  </div>
                  <div className="recycle-details">
                    <div className="disposal-method">
                      <span className="method-icon">
                        {product.recycleType === 'compost' ? '🌱' : product.recycleType === 'recycle' ? '♻️' : '🗑️'}
                      </span>
                      <div>
                        <span className="method-label">Disposal Method</span>
                        <span className="method-name">{product.disposalMethod}</span>
                      </div>
                    </div>
                    <div className="disposal-partner">
                      <span className="partner-icon">🏭</span>
                      <div>
                        <span className="partner-label">Processing Partner</span>
                        <span className="partner-name">{product.disposalPartner}</span>
                      </div>
                    </div>
                    <div className="recycle-stats">
                      <div className="recycle-stat">
                        <span className={`env-badge ${product.recyclable ? 'eco' : 'standard'}`}>
                          {product.recyclable ? '🌿 Eco-Friendly' : '⚠️ Standard'}
                        </span>
                      </div>
                      <div className="recycle-stat">
                        <span className="stat-value">₹{product.processingCost}</span>
                        <span className="stat-label">Est. Cost</span>
                      </div>
                    </div>
                  </div>
                  <div className="recycle-actions">
                    <button className="recycle-btn">
                      <span>📦</span> Schedule Pickup
                    </button>
                    <button className="contact-btn">
                      <span>📞</span> Contact Partner
                    </button>
                  </div>
                </div>
              ))}
              <div className="recycle-summary">
                <div className="summary-item">
                  <span className="summary-icon">🌱</span>
                  <div>
                    <span className="summary-value">{filteredProducts.filter(p => p.recycleType === 'compost').length} items</span>
                    <span className="summary-label">Compostable</span>
                  </div>
                </div>
                <div className="summary-item">
                  <span className="summary-icon">♻️</span>
                  <div>
                    <span className="summary-value">{filteredProducts.filter(p => p.recycleType === 'recycle').length} items</span>
                    <span className="summary-label">Recyclable Packaging</span>
                  </div>
                </div>
                <div className="summary-item">
                  <span className="summary-icon">💰</span>
                  <div>
                    <span className="summary-value">₹{filteredProducts.reduce((sum, p) => sum + p.processingCost, 0)}</span>
                    <span className="summary-label">Total Processing Cost</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="expiry-footer">
          <div className="footer-info">
            <span className="info-icon">💡</span>
            <span>Auto-notifications sent to inventory managers for critical items</span>
          </div>
          <button className="export-btn">
            <span>📊</span> Export Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExpiryDashboard
