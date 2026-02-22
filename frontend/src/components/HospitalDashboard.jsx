import { useState, useMemo } from 'react'
import './HospitalDashboard.css'

function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Medical inventory data
  const [medicalInventory] = useState([
    { id: 1, name: 'Paracetamol 500mg', category: 'Medicines', stock: 2500, unit: 'tablets', expiryDate: '2026-08-15', status: 'adequate', reorderLevel: 500, price: 2.5 },
    { id: 2, name: 'Insulin (Humalog)', category: 'Medicines', stock: 150, unit: 'vials', expiryDate: '2026-04-20', status: 'low', reorderLevel: 200, price: 850 },
    { id: 3, name: 'Surgical Gloves (L)', category: 'Supplies', stock: 5000, unit: 'pairs', expiryDate: '2027-12-01', status: 'adequate', reorderLevel: 1000, price: 8 },
    { id: 4, name: 'N95 Masks', category: 'PPE', stock: 800, unit: 'pieces', expiryDate: '2027-06-30', status: 'adequate', reorderLevel: 500, price: 45 },
    { id: 5, name: 'IV Saline 500ml', category: 'Fluids', stock: 320, unit: 'bags', expiryDate: '2026-11-10', status: 'adequate', reorderLevel: 200, price: 55 },
    { id: 6, name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 180, unit: 'strips', expiryDate: '2026-03-25', status: 'expiring', reorderLevel: 300, price: 35 },
    { id: 7, name: 'Blood Collection Tubes', category: 'Lab Supplies', stock: 1200, unit: 'pieces', expiryDate: '2027-09-15', status: 'adequate', reorderLevel: 500, price: 12 },
    { id: 8, name: 'Oxygen Cylinders', category: 'Equipment', stock: 45, unit: 'units', expiryDate: null, status: 'critical', reorderLevel: 50, price: 4500 },
    { id: 9, name: 'Bandage Rolls', category: 'Supplies', stock: 600, unit: 'rolls', expiryDate: '2028-01-20', status: 'adequate', reorderLevel: 200, price: 25 },
    { id: 10, name: 'Cetrizine 10mg', category: 'Medicines', stock: 90, unit: 'strips', expiryDate: '2026-05-10', status: 'low', reorderLevel: 150, price: 18 }
  ])

  // Hospital departments
  const [departments] = useState([
    { id: 1, name: 'Emergency', beds: 50, occupied: 42, staff: 35, критичность: 'high' },
    { id: 2, name: 'ICU', beds: 30, occupied: 28, staff: 45, критичность: 'critical' },
    { id: 3, name: 'General Ward', beds: 200, occupied: 165, staff: 80, критичность: 'normal' },
    { id: 4, name: 'Pediatrics', beds: 40, occupied: 25, staff: 25, критичность: 'normal' },
    { id: 5, name: 'Maternity', beds: 35, occupied: 30, staff: 30, критичность: 'high' },
    { id: 6, name: 'Surgery', beds: 25, occupied: 20, staff: 40, критичность: 'high' }
  ])

  // Hospital equipment with locations
  const [hospitalEquipment] = useState([
    // Wheelchairs
    { id: 1, name: 'Wheelchair #1', type: 'wheelchair', status: 'available', location: 'Emergency', floor: 'Ground', x: 80, y: 120, battery: null },
    { id: 2, name: 'Wheelchair #2', type: 'wheelchair', status: 'in-use', location: 'General Ward', floor: '1st', x: 320, y: 180, battery: null },
    { id: 3, name: 'Wheelchair #3', type: 'wheelchair', status: 'available', location: 'Pediatrics', floor: '2nd', x: 450, y: 100, battery: null },
    { id: 4, name: 'Wheelchair #4', type: 'wheelchair', status: 'maintenance', location: 'Storage', floor: 'Ground', x: 150, y: 350, battery: null },
    { id: 5, name: 'Electric Wheelchair', type: 'wheelchair', status: 'available', location: 'ICU', floor: '1st', x: 220, y: 80, battery: 85 },
    // Stretchers/Trolleys
    { id: 6, name: 'Stretcher #1', type: 'stretcher', status: 'available', location: 'Emergency', floor: 'Ground', x: 120, y: 150, battery: null },
    { id: 7, name: 'Stretcher #2', type: 'stretcher', status: 'in-use', location: 'Surgery', floor: '2nd', x: 380, y: 220, battery: null },
    { id: 8, name: 'Trolley #1', type: 'stretcher', status: 'available', location: 'ICU', floor: '1st', x: 280, y: 120, battery: null },
    { id: 9, name: 'Trolley #2', type: 'stretcher', status: 'available', location: 'Maternity', floor: '2nd', x: 520, y: 180, battery: null },
    { id: 10, name: 'Emergency Stretcher', type: 'stretcher', status: 'in-use', location: 'Emergency', floor: 'Ground', x: 60, y: 200, battery: null },
    // Oxygen Cylinders & Concentrators
    { id: 11, name: 'O2 Cylinder #1', type: 'oxygen', status: 'in-use', location: 'ICU', floor: '1st', x: 250, y: 60, battery: null, level: 75 },
    { id: 12, name: 'O2 Cylinder #2', type: 'oxygen', status: 'available', location: 'Emergency', floor: 'Ground', x: 100, y: 100, battery: null, level: 100 },
    { id: 13, name: 'O2 Cylinder #3', type: 'oxygen', status: 'low', location: 'General Ward', floor: '1st', x: 350, y: 150, battery: null, level: 20 },
    { id: 14, name: 'O2 Concentrator #1', type: 'oxygen', status: 'in-use', location: 'ICU', floor: '1st', x: 200, y: 100, battery: null, level: 90 },
    { id: 15, name: 'O2 Concentrator #2', type: 'oxygen', status: 'available', location: 'Surgery', floor: '2nd', x: 420, y: 250, battery: null, level: 100 },
    // Suction Machines
    { id: 16, name: 'Suction Machine #1', type: 'suction', status: 'in-use', location: 'ICU', floor: '1st', x: 180, y: 140, battery: 92 },
    { id: 17, name: 'Suction Machine #2', type: 'suction', status: 'available', location: 'Surgery', floor: '2nd', x: 400, y: 280, battery: 100 },
    { id: 18, name: 'Suction Machine #3', type: 'suction', status: 'maintenance', location: 'Storage', floor: 'Ground', x: 180, y: 380, battery: 45 },
    { id: 19, name: 'Portable Suction', type: 'suction', status: 'in-use', location: 'Emergency', floor: 'Ground', x: 140, y: 180, battery: 68 },
    { id: 20, name: 'Suction Machine #4', type: 'suction', status: 'available', location: 'Pediatrics', floor: '2nd', x: 480, y: 140, battery: 100 }
  ])

  // Equipment type config
  const equipmentTypes = {
    wheelchair: { icon: '♿', label: 'Wheelchair', color: '#3B82F6' },
    stretcher: { icon: '🛏️', label: 'Stretcher/Trolley', color: '#10B981' },
    oxygen: { icon: '💨', label: 'O2 Cylinder/Concentrator', color: '#F59E0B' },
    suction: { icon: '🔌', label: 'Suction Machine', color: '#8B5CF6' }
  }

  // Equipment filter state
  const [equipmentFilter, setEquipmentFilter] = useState('all')
  const [selectedEquipment, setSelectedEquipment] = useState(null)

  // Filter equipment
  const filteredEquipment = useMemo(() => {
    if (equipmentFilter === 'all') return hospitalEquipment
    return hospitalEquipment.filter(eq => eq.type === equipmentFilter)
  }, [hospitalEquipment, equipmentFilter])

  // Equipment stats
  const equipmentStats = useMemo(() => {
    return {
      total: hospitalEquipment.length,
      available: hospitalEquipment.filter(e => e.status === 'available').length,
      inUse: hospitalEquipment.filter(e => e.status === 'in-use').length,
      maintenance: hospitalEquipment.filter(e => e.status === 'maintenance').length,
      wheelchairs: hospitalEquipment.filter(e => e.type === 'wheelchair').length,
      stretchers: hospitalEquipment.filter(e => e.type === 'stretcher').length,
      oxygen: hospitalEquipment.filter(e => e.type === 'oxygen').length,
      suction: hospitalEquipment.filter(e => e.type === 'suction').length
    }
  }, [hospitalEquipment])

  // Recent supply requests
  const [supplyRequests] = useState([
    { id: 1, department: 'ICU', item: 'Oxygen Cylinders', quantity: 10, priority: 'urgent', status: 'pending', requestedAt: '2026-02-22 09:30' },
    { id: 2, department: 'Emergency', item: 'IV Saline 500ml', quantity: 50, priority: 'high', status: 'approved', requestedAt: '2026-02-22 08:15' },
    { id: 3, department: 'General Ward', item: 'Paracetamol 500mg', quantity: 200, priority: 'normal', status: 'delivered', requestedAt: '2026-02-21 14:00' },
    { id: 4, department: 'Surgery', item: 'Surgical Gloves (L)', quantity: 500, priority: 'high', status: 'in-transit', requestedAt: '2026-02-22 07:45' },
    { id: 5, department: 'Pediatrics', item: 'Cetrizine 10mg', quantity: 30, priority: 'normal', status: 'pending', requestedAt: '2026-02-22 10:00' }
  ])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = medicalInventory.length
    const lowStockItems = medicalInventory.filter(i => i.status === 'low' || i.status === 'critical').length
    const expiringItems = medicalInventory.filter(i => i.status === 'expiring').length
    const totalValue = medicalInventory.reduce((acc, item) => acc + (item.stock * item.price), 0)
    
    const totalBeds = departments.reduce((acc, d) => acc + d.beds, 0)
    const occupiedBeds = departments.reduce((acc, d) => acc + d.occupied, 0)
    const occupancyRate = ((occupiedBeds / totalBeds) * 100).toFixed(1)
    
    const pendingRequests = supplyRequests.filter(r => r.status === 'pending').length
    const urgentRequests = supplyRequests.filter(r => r.priority === 'urgent').length

    return { totalItems, lowStockItems, expiringItems, totalValue, totalBeds, occupiedBeds, occupancyRate, pendingRequests, urgentRequests }
  }, [medicalInventory, departments, supplyRequests])

  // Filter inventory based on search and category
  const filteredInventory = useMemo(() => {
    return medicalInventory.filter(item => {
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [medicalInventory, searchQuery, categoryFilter])

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(medicalInventory.map(item => item.category))]
  }, [medicalInventory])

  const getStatusColor = (status) => {
    switch (status) {
      case 'adequate': return '#10B981'
      case 'low': return '#F59E0B'
      case 'critical': return '#EF4444'
      case 'expiring': return '#8B5CF6'
      default: return '#6B7280'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#EF4444'
      case 'high': return '#F59E0B'
      case 'normal': return '#10B981'
      default: return '#6B7280'
    }
  }

  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#F59E0B'
      case 'approved': return '#3B82F6'
      case 'in-transit': return '#8B5CF6'
      case 'delivered': return '#10B981'
      default: return '#6B7280'
    }
  }

  return (
    <div className="hospital-dashboard">
      {/* Header */}
      <div className="hospital-header">
        <div className="header-content">
          <h1>🏥 Hospital Supply Dashboard</h1>
          <p>Medical Inventory & Department Management</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <span>📊</span> Reports
          </button>
          <button className="btn-primary">
            <span>➕</span> Add Item
          </button>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="hospital-stats-panel">
          <div className="hospital-stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalItems}</span>
              <span className="stat-label">Total Items</span>
            </div>
          </div>
          <div className="hospital-stat-card warning">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <span className="stat-value">{stats.lowStockItems}</span>
              <span className="stat-label">Low Stock</span>
            </div>
          </div>
          <div className="hospital-stat-card danger">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <span className="stat-value">{stats.expiringItems}</span>
              <span className="stat-label">Expiring Soon</span>
            </div>
          </div>
          <div className="hospital-stat-card info">
            <div className="stat-icon">🛏️</div>
            <div className="stat-content">
              <span className="stat-value">{stats.occupancyRate}%</span>
              <span className="stat-label">Bed Occupancy</span>
            </div>
          </div>
          <div className="hospital-stat-card success">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-value">₹{(stats.totalValue / 100000).toFixed(1)}L</span>
              <span className="stat-label">Inventory Value</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="hospital-search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="hospital-tabs">
          <button 
            className={`hospital-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`hospital-tab ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            💊 Inventory
          </button>
          <button 
            className={`hospital-tab ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            🏢 Departments
          </button>
          <button 
            className={`hospital-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            📋 Requests
            {stats.pendingRequests > 0 && <span className="tab-badge">{stats.pendingRequests}</span>}
          </button>
          <button 
            className={`hospital-tab ${activeTab === 'equipment-map' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipment-map')}
          >
            🗺️ Equipment Map
          </button>
        </div>

        {/* Tab Content */}
        <div className="hospital-content">
          {activeTab === 'overview' && (
            <div className="hospital-overview">
              {/* Critical Alerts */}
              <div className="overview-section">
                <h3>🚨 Critical Alerts</h3>
                <div className="critical-alerts">
                  {stats.urgentRequests > 0 && (
                    <div className="alert-card urgent">
                      <span className="alert-icon">🔴</span>
                      <div className="alert-content">
                        <strong>{stats.urgentRequests} Urgent Request(s)</strong>
                        <p>Immediate attention required</p>
                      </div>
                    </div>
                  )}
                  {medicalInventory.filter(i => i.status === 'critical').map(item => (
                    <div key={item.id} className="alert-card critical">
                      <span className="alert-icon">⚠️</span>
                      <div className="alert-content">
                        <strong>{item.name} - Critical Stock</strong>
                        <p>Only {item.stock} {item.unit} remaining</p>
                      </div>
                    </div>
                  ))}
                  {medicalInventory.filter(i => i.status === 'expiring').map(item => (
                    <div key={item.id} className="alert-card expiring">
                      <span className="alert-icon">⏰</span>
                      <div className="alert-content">
                        <strong>{item.name} - Expiring Soon</strong>
                        <p>Expires on {item.expiryDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Overview */}
              <div className="overview-section">
                <h3>🏢 Department Status</h3>
                <div className="department-grid">
                  {departments.map(dept => (
                    <div key={dept.id} className="dept-card">
                      <div className="dept-header">
                        <span className="dept-name">{dept.name}</span>
                        <span className={`dept-status ${dept.критичность}`}>
                          {dept.критичность === 'critical' ? '🔴' : dept.критичность === 'high' ? '🟠' : '🟢'}
                        </span>
                      </div>
                      <div className="dept-stats">
                        <div className="dept-stat">
                          <span className="dept-stat-label">Beds</span>
                          <span className="dept-stat-value">{dept.occupied}/{dept.beds}</span>
                        </div>
                        <div className="dept-stat">
                          <span className="dept-stat-label">Staff</span>
                          <span className="dept-stat-value">{dept.staff}</span>
                        </div>
                      </div>
                      <div className="dept-occupancy-bar">
                        <div 
                          className="dept-occupancy-fill"
                          style={{ 
                            width: `${(dept.occupied / dept.beds) * 100}%`,
                            backgroundColor: (dept.occupied / dept.beds) > 0.9 ? '#EF4444' : (dept.occupied / dept.beds) > 0.7 ? '#F59E0B' : '#10B981'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory Summary */}
              <div className="overview-section">
                <h3>📊 Inventory Summary</h3>
                <div className="inventory-summary">
                  <div className="summary-chart">
                    {['Medicines', 'Supplies', 'PPE', 'Fluids', 'Equipment', 'Lab Supplies', 'Antibiotics'].map(category => {
                      const items = medicalInventory.filter(i => i.category === category)
                      const value = items.reduce((acc, i) => acc + (i.stock * i.price), 0)
                      return (
                        <div key={category} className="summary-bar">
                          <span className="summary-label">{category}</span>
                          <div className="summary-bar-track">
                            <div 
                              className="summary-bar-fill"
                              style={{ width: `${Math.min((value / stats.totalValue) * 100 * 5, 100)}%` }}
                            />
                          </div>
                          <span className="summary-value">₹{(value / 1000).toFixed(1)}K</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="hospital-inventory">
              <div className="inventory-controls">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input 
                    type="text"
                    placeholder="Search medicines, supplies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="add-item-btn">+ Add Item</button>
              </div>

              <div className="inventory-table">
                <div className="table-header">
                  <span>Item Name</span>
                  <span>Category</span>
                  <span>Stock</span>
                  <span>Expiry</span>
                  <span>Status</span>
                  <span>Value</span>
                </div>
                {filteredInventory.map(item => (
                  <div key={item.id} className="table-row">
                    <span className="item-name">{item.name}</span>
                    <span className="item-category">{item.category}</span>
                    <span className="item-stock">{item.stock} {item.unit}</span>
                    <span className="item-expiry">{item.expiryDate || 'N/A'}</span>
                    <span className="item-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(item.status) }}
                      >
                        {item.status}
                      </span>
                    </span>
                    <span className="item-value">₹{(item.stock * item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="hospital-departments">
              <div className="departments-header">
                <h3>Department Resource Management</h3>
                <div className="total-stats">
                  <span>Total Beds: <strong>{stats.totalBeds}</strong></span>
                  <span>Occupied: <strong>{stats.occupiedBeds}</strong></span>
                  <span>Available: <strong>{stats.totalBeds - stats.occupiedBeds}</strong></span>
                </div>
              </div>

              <div className="departments-list">
                {departments.map(dept => (
                  <div key={dept.id} className="department-card">
                    <div className="department-info">
                      <h4>{dept.name}</h4>
                      <span className={`criticality-badge ${dept.критичность}`}>
                        {dept.критичность.toUpperCase()}
                      </span>
                    </div>
                    <div className="department-metrics">
                      <div className="metric">
                        <span className="metric-icon">🛏️</span>
                        <div className="metric-details">
                          <span className="metric-value">{dept.occupied}/{dept.beds}</span>
                          <span className="metric-label">Beds Occupied</span>
                        </div>
                        <div className="metric-bar">
                          <div 
                            className="metric-fill"
                            style={{ 
                              width: `${(dept.occupied / dept.beds) * 100}%`,
                              backgroundColor: (dept.occupied / dept.beds) > 0.9 ? '#EF4444' : (dept.occupied / dept.beds) > 0.7 ? '#F59E0B' : '#10B981'
                            }}
                          />
                        </div>
                      </div>
                      <div className="metric">
                        <span className="metric-icon">👨‍⚕️</span>
                        <div className="metric-details">
                          <span className="metric-value">{dept.staff}</span>
                          <span className="metric-label">Staff Members</span>
                        </div>
                      </div>
                      <div className="metric">
                        <span className="metric-icon">📊</span>
                        <div className="metric-details">
                          <span className="metric-value">{((dept.occupied / dept.beds) * 100).toFixed(0)}%</span>
                          <span className="metric-label">Occupancy Rate</span>
                        </div>
                      </div>
                    </div>
                    <div className="department-actions">
                      <button className="dept-action-btn">View Details</button>
                      <button className="dept-action-btn primary">Request Supply</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="hospital-requests">
              <div className="requests-header">
                <h3>Supply Requests</h3>
                <button className="new-request-btn">+ New Request</button>
              </div>

              <div className="requests-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Pending ({stats.pendingRequests})</button>
                <button className="filter-btn">Approved</button>
                <button className="filter-btn">In Transit</button>
                <button className="filter-btn">Delivered</button>
              </div>

              <div className="requests-list">
                {supplyRequests.map(request => (
                  <div key={request.id} className="request-card">
                    <div className="request-header">
                      <span className="request-dept">{request.department}</span>
                      <span 
                        className="request-priority"
                        style={{ backgroundColor: getPriorityColor(request.priority) }}
                      >
                        {request.priority}
                      </span>
                    </div>
                    <div className="request-body">
                      <div className="request-item">
                        <span className="request-item-name">{request.item}</span>
                        <span className="request-quantity">Qty: {request.quantity}</span>
                      </div>
                      <span className="request-time">{request.requestedAt}</span>
                    </div>
                    <div className="request-footer">
                      <span 
                        className="request-status"
                        style={{ backgroundColor: getRequestStatusColor(request.status) }}
                      >
                        {request.status}
                      </span>
                      {request.status === 'pending' && (
                        <div className="request-actions">
                          <button className="approve-btn">✓ Approve</button>
                          <button className="reject-btn">✗ Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'equipment-map' && (
            <div className="hospital-equipment-map">
              {/* Equipment Stats Bar */}
              <div className="equipment-stats-bar">
                <div className="eq-stat">
                  <span className="eq-stat-value">{equipmentStats.total}</span>
                  <span className="eq-stat-label">Total</span>
                </div>
                <div className="eq-stat available">
                  <span className="eq-stat-value">{equipmentStats.available}</span>
                  <span className="eq-stat-label">Available</span>
                </div>
                <div className="eq-stat in-use">
                  <span className="eq-stat-value">{equipmentStats.inUse}</span>
                  <span className="eq-stat-label">In Use</span>
                </div>
                <div className="eq-stat maintenance">
                  <span className="eq-stat-value">{equipmentStats.maintenance}</span>
                  <span className="eq-stat-label">Maintenance</span>
                </div>
              </div>

              {/* Equipment Filter */}
              <div className="equipment-filter-bar">
                <button 
                  className={`eq-filter-btn ${equipmentFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setEquipmentFilter('all')}
                >
                  All ({equipmentStats.total})
                </button>
                <button 
                  className={`eq-filter-btn ${equipmentFilter === 'wheelchair' ? 'active' : ''}`}
                  onClick={() => setEquipmentFilter('wheelchair')}
                >
                  ♿ Wheelchairs ({equipmentStats.wheelchairs})
                </button>
                <button 
                  className={`eq-filter-btn ${equipmentFilter === 'stretcher' ? 'active' : ''}`}
                  onClick={() => setEquipmentFilter('stretcher')}
                >
                  🛏️ Stretchers ({equipmentStats.stretchers})
                </button>
                <button 
                  className={`eq-filter-btn ${equipmentFilter === 'oxygen' ? 'active' : ''}`}
                  onClick={() => setEquipmentFilter('oxygen')}
                >
                  💨 O2 Equipment ({equipmentStats.oxygen})
                </button>
                <button 
                  className={`eq-filter-btn ${equipmentFilter === 'suction' ? 'active' : ''}`}
                  onClick={() => setEquipmentFilter('suction')}
                >
                  🔌 Suction ({equipmentStats.suction})
                </button>
              </div>

              {/* Hospital Floor Map */}
              <div className="hospital-map-container">
                <div className="hospital-floor-map">
                  {/* Floor Labels */}
                  <div className="floor-section ground-floor">
                    <div className="floor-label">Ground Floor</div>
                    <div className="floor-rooms">
                      <div className="room emergency">
                        <span className="room-name">Emergency</span>
                      </div>
                      <div className="room storage">
                        <span className="room-name">Storage</span>
                      </div>
                      <div className="room reception">
                        <span className="room-name">Reception</span>
                      </div>
                    </div>
                  </div>
                  <div className="floor-section first-floor">
                    <div className="floor-label">1st Floor</div>
                    <div className="floor-rooms">
                      <div className="room icu">
                        <span className="room-name">ICU</span>
                      </div>
                      <div className="room general-ward">
                        <span className="room-name">General Ward</span>
                      </div>
                    </div>
                  </div>
                  <div className="floor-section second-floor">
                    <div className="floor-label">2nd Floor</div>
                    <div className="floor-rooms">
                      <div className="room surgery">
                        <span className="room-name">Surgery</span>
                      </div>
                      <div className="room maternity">
                        <span className="room-name">Maternity</span>
                      </div>
                      <div className="room pediatrics">
                        <span className="room-name">Pediatrics</span>
                      </div>
                    </div>
                  </div>

                  {/* Equipment Markers */}
                  {filteredEquipment.map(eq => (
                    <div
                      key={eq.id}
                      className={`equipment-marker ${eq.status} ${selectedEquipment?.id === eq.id ? 'selected' : ''}`}
                      style={{
                        left: `${eq.x}px`,
                        top: `${eq.y}px`,
                        backgroundColor: equipmentTypes[eq.type].color
                      }}
                      onClick={() => setSelectedEquipment(eq)}
                      title={`${eq.name} - ${eq.location}`}
                    >
                      <span className="marker-icon">{equipmentTypes[eq.type].icon}</span>
                      {eq.status === 'maintenance' && <span className="marker-alert">⚠️</span>}
                      {eq.type === 'oxygen' && eq.level < 30 && <span className="marker-alert">🔴</span>}
                    </div>
                  ))}
                </div>

                {/* Equipment Legend */}
                <div className="equipment-legend">
                  <h4>Legend</h4>
                  <div className="legend-items">
                    {Object.entries(equipmentTypes).map(([key, value]) => (
                      <div key={key} className="legend-item">
                        <span className="legend-icon" style={{ backgroundColor: value.color }}>{value.icon}</span>
                        <span className="legend-label">{value.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="legend-status">
                    <h5>Status</h5>
                    <div className="status-item"><span className="status-dot available"></span> Available</div>
                    <div className="status-item"><span className="status-dot in-use"></span> In Use</div>
                    <div className="status-item"><span className="status-dot maintenance"></span> Maintenance</div>
                  </div>
                </div>
              </div>

              {/* Selected Equipment Details */}
              {selectedEquipment && (
                <div className="equipment-details-panel">
                  <div className="eq-details-header">
                    <span className="eq-details-icon" style={{ backgroundColor: equipmentTypes[selectedEquipment.type].color }}>
                      {equipmentTypes[selectedEquipment.type].icon}
                    </span>
                    <div className="eq-details-title">
                      <h4>{selectedEquipment.name}</h4>
                      <span className={`eq-status-badge ${selectedEquipment.status}`}>{selectedEquipment.status}</span>
                    </div>
                    <button className="eq-details-close" onClick={() => setSelectedEquipment(null)}>×</button>
                  </div>
                  <div className="eq-details-body">
                    <div className="eq-detail-row">
                      <span className="eq-detail-label">Type:</span>
                      <span className="eq-detail-value">{equipmentTypes[selectedEquipment.type].label}</span>
                    </div>
                    <div className="eq-detail-row">
                      <span className="eq-detail-label">Location:</span>
                      <span className="eq-detail-value">{selectedEquipment.location}</span>
                    </div>
                    <div className="eq-detail-row">
                      <span className="eq-detail-label">Floor:</span>
                      <span className="eq-detail-value">{selectedEquipment.floor} Floor</span>
                    </div>
                    {selectedEquipment.battery !== null && (
                      <div className="eq-detail-row">
                        <span className="eq-detail-label">Battery:</span>
                        <div className="eq-battery-bar">
                          <div 
                            className="eq-battery-fill"
                            style={{ 
                              width: `${selectedEquipment.battery}%`,
                              backgroundColor: selectedEquipment.battery > 50 ? '#10B981' : selectedEquipment.battery > 20 ? '#F59E0B' : '#EF4444'
                            }}
                          />
                        </div>
                        <span className="eq-battery-text">{selectedEquipment.battery}%</span>
                      </div>
                    )}
                    {selectedEquipment.level !== undefined && (
                      <div className="eq-detail-row">
                        <span className="eq-detail-label">O2 Level:</span>
                        <div className="eq-battery-bar">
                          <div 
                            className="eq-battery-fill"
                            style={{ 
                              width: `${selectedEquipment.level}%`,
                              backgroundColor: selectedEquipment.level > 50 ? '#10B981' : selectedEquipment.level > 20 ? '#F59E0B' : '#EF4444'
                            }}
                          />
                        </div>
                        <span className="eq-battery-text">{selectedEquipment.level}%</span>
                      </div>
                    )}
                  </div>
                  <div className="eq-details-actions">
                    {selectedEquipment.status === 'available' && (
                      <button className="eq-action-btn assign">📋 Assign</button>
                    )}
                    {selectedEquipment.status === 'in-use' && (
                      <button className="eq-action-btn release">✓ Mark Available</button>
                    )}
                    <button className="eq-action-btn locate">📍 Navigate</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  )
}

export default HospitalDashboard
