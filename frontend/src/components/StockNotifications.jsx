import { useState, useMemo } from 'react'
import './StockNotifications.css'

function StockNotifications({ isOpen, onClose }) {
  // Mock stock arrival notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      productName: 'Nike Air Max 90',
      quantity: 150,
      sku: 'SH-001',
      category: 'Shoes',
      arrivalTime: '2 hours ago',
      status: 'just_arrived',
      location: 'Rack A-5',
      supplier: 'Nike Distribution Center',
      priority: 'high'
    },
    {
      id: 2,
      productName: 'Adidas Ultraboost',
      quantity: 120,
      sku: 'SH-002',
      category: 'Shoes',
      arrivalTime: '5 hours ago',
      status: 'just_arrived',
      location: 'Rack A-6',
      supplier: 'Adidas Global',
      priority: 'medium'
    },
    {
      id: 3,
      productName: 'Sony WH-1000XM5',
      quantity: 80,
      sku: 'AC-001',
      category: 'Accessories',
      arrivalTime: '12 hours ago',
      status: 'arrived',
      location: 'Rack C-2',
      supplier: 'Sony Electronics',
      priority: 'high'
    },
    {
      id: 4,
      productName: 'Dyson V15 Vacuum',
      quantity: 45,
      sku: 'AP-001',
      category: 'Appliances',
      arrivalTime: '1 day ago',
      status: 'arrived',
      location: 'Rack D-1',
      supplier: 'Dyson Corporation',
      priority: 'medium'
    },
    {
      id: 5,
      productName: 'Canon EOS R5',
      quantity: 25,
      sku: 'EL-001',
      category: 'Electronics',
      arrivalTime: '2 days ago',
      status: 'processing',
      location: 'Rack E-3',
      supplier: 'Canon Inc',
      priority: 'low'
    }
  ])

  // Analyze notifications
  const analysis = useMemo(() => {
    const justArrived = notifications.filter(n => n.status === 'just_arrived').length
    const totalQuantity = notifications.reduce((sum, n) => sum + n.quantity, 0)
    const categories = [...new Set(notifications.map(n => n.category))]
    const highPriority = notifications.filter(n => n.priority === 'high').length

    return {
      totalNotifications: notifications.length,
      justArrived,
      totalQuantity,
      categories,
      highPriority,
      averageQuantity: Math.round(totalQuantity / notifications.length)
    }
  }, [notifications])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'just_arrived':
        return { icon: '✅', label: 'Just Arrived', color: '#10B981' }
      case 'arrived':
        return { icon: '📦', label: 'Ready', color: '#3B82F6' }
      case 'processing':
        return { icon: '⏳', label: 'Processing', color: '#F59E0B' }
      default:
        return { icon: '❓', label: 'Unknown', color: '#6B7280' }
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#EF4444'
      case 'medium':
        return '#F59E0B'
      case 'low':
        return '#3B82F6'
      default:
        return '#6B7280'
    }
  }

  if (!isOpen) return null

  return (
    <div className="stock-notification-overlay">
      <div className="stock-notification-panel">
        {/* Header */}
        <div className="stock-header">
          <div className="stock-title-section">
            <span className="stock-icon">📦</span>
            <div>
              <h2 className="stock-title">Stock Arrivals</h2>
              <p className="stock-subtitle">Real-time inventory updates</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Stats Grid */}
        <div className="stock-stats-grid">
          <div className="stat-card arrived-stat">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-number">{analysis.justArrived}</div>
              <div className="stat-label">Just Arrived</div>
            </div>
          </div>
          <div className="stat-card quantity-stat">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-number">{analysis.totalQuantity}</div>
              <div className="stat-label">Total Units</div>
            </div>
          </div>
          <div className="stat-card priority-stat">
            <div className="stat-icon">🔴</div>
            <div className="stat-info">
              <div className="stat-number">{analysis.highPriority}</div>
              <div className="stat-label">High Priority</div>
            </div>
          </div>
          <div className="stat-card category-stat">
            <div className="stat-icon">🏷️</div>
            <div className="stat-info">
              <div className="stat-number">{analysis.categories.length}</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="stock-tabs">
          <button className="tab-btn active">All Items ({analysis.totalNotifications})</button>
          <button className="tab-btn">Just Arrived ({analysis.justArrived})</button>
          <button className="tab-btn">High Priority ({analysis.highPriority})</button>
        </div>

        {/* Notifications List */}
        <div className="stock-notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>No stock notifications</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const status = getStatusBadge(notification.status)
              return (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.status}`}
                >
                  {/* Left Section - Product Info */}
                  <div className="notification-left">
                    <div className="product-icon">
                      {notification.category === 'Shoes' && '👟'}
                      {notification.category === 'Accessories' && '🎧'}
                      {notification.category === 'Appliances' && '🧹'}
                      {notification.category === 'Electronics' && '📷'}
                    </div>
                    <div className="product-details">
                      <div className="product-name">{notification.productName}</div>
                      <div className="product-meta">
                        <span className="sku">SKU: {notification.sku}</span>
                        <span className="separator">•</span>
                        <span className="location">📍 {notification.location}</span>
                      </div>
                      <div className="supplier-info">Supplier: {notification.supplier}</div>
                    </div>
                  </div>

                  {/* Middle Section - Quantity & Status */}
                  <div className="notification-middle">
                    <div className="quantity-badge">
                      <div className="quantity-number">{notification.quantity}</div>
                      <div className="quantity-label">units</div>
                    </div>
                    <div className="status-badge" style={{ backgroundColor: status.color }}>
                      <span>{status.icon}</span>
                      <span>{status.label}</span>
                    </div>
                  </div>

                  {/* Right Section - Time & Priority */}
                  <div className="notification-right">
                    <div className="arrival-time">{notification.arrivalTime}</div>
                    <div 
                      className="priority-indicator"
                      style={{ borderLeftColor: getPriorityColor(notification.priority) }}
                    >
                      <span className="priority-badge">
                        {notification.priority === 'high' && '🔴 High'}
                        {notification.priority === 'medium' && '🟡 Medium'}
                        {notification.priority === 'low' && '🔵 Low'}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="action-btn" title="View details">
                    →
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="stock-footer">
          <div className="footer-message">
            👷 Workers are notified automatically about high-priority arrivals
          </div>
          <button className="refresh-btn" onClick={() => setNotifications([...notifications])}>
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  )
}

export default StockNotifications
