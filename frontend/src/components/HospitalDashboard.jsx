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

              {/* Hospital Floor Map - Real SVG Visualization */}
              <div className="hospital-map-container">
                <div className="hospital-floor-map">
                  <svg viewBox="0 0 800 500" className="hospital-svg-map">
                    {/* Background Grid */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5"/>
                      </pattern>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.15"/>
                      </filter>
                    </defs>
                    <rect width="800" height="500" fill="url(#grid)"/>
                    
                    {/* Hospital Building Outline */}
                    <rect x="20" y="20" width="760" height="460" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="3" rx="8"/>
                    
                    {/* Main Corridor */}
                    <rect x="350" y="20" width="100" height="460" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" strokeDasharray="5,5"/>
                    <text x="400" y="250" textAnchor="middle" className="corridor-label" transform="rotate(-90, 400, 250)">Main Corridor</text>
                    
                    {/* GROUND FLOOR - Left Side */}
                    <g className="floor-group ground-floor-rooms">
                      {/* Emergency Room */}
                      <rect x="30" y="30" width="150" height="140" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" rx="4" filter="url(#shadow)"/>
                      <text x="105" y="55" textAnchor="middle" className="room-label emergency-label">🚨 Emergency</text>
                      <text x="105" y="75" textAnchor="middle" className="room-sublabel">Critical Care</text>
                      {/* Beds visualization */}
                      <rect x="40" y="90" width="30" height="15" fill="#fff" stroke="#EF4444" rx="2"/>
                      <rect x="80" y="90" width="30" height="15" fill="#fff" stroke="#EF4444" rx="2"/>
                      <rect x="120" y="90" width="30" height="15" fill="#fff" stroke="#EF4444" rx="2"/>
                      <rect x="40" y="115" width="30" height="15" fill="#fff" stroke="#EF4444" rx="2"/>
                      <rect x="80" y="115" width="30" height="15" fill="#fff" stroke="#EF4444" rx="2"/>
                      <rect x="120" y="115" width="30" height="15" fill="#fff" stroke="#EF4444" rx="2"/>
                      <rect x="40" y="140" width="130" height="20" fill="#FECACA" rx="2"/>
                      <text x="105" y="154" textAnchor="middle" className="room-count">6 Beds</text>
                      
                      {/* Reception */}
                      <rect x="190" y="30" width="150" height="100" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" rx="4" filter="url(#shadow)"/>
                      <text x="265" y="55" textAnchor="middle" className="room-label">🏥 Reception</text>
                      <text x="265" y="75" textAnchor="middle" className="room-sublabel">Patient Registration</text>
                      <rect x="200" y="90" width="60" height="30" fill="#fff" stroke="#3B82F6" rx="2"/>
                      <text x="230" y="110" textAnchor="middle" className="desk-label">Desk</text>
                      <circle cx="300" cy="105" r="12" fill="#BFDBFE" stroke="#3B82F6"/>
                      <text x="300" y="110" textAnchor="middle" className="seat-label">🪑</text>
                      
                      {/* Storage */}
                      <rect x="30" y="180" width="150" height="130" fill="#E5E7EB" stroke="#6B7280" strokeWidth="2" rx="4" filter="url(#shadow)"/>
                      <text x="105" y="205" textAnchor="middle" className="room-label">📦 Storage</text>
                      <text x="105" y="225" textAnchor="middle" className="room-sublabel">Equipment &amp; Supplies</text>
                      {/* Shelves */}
                      <rect x="40" y="240" width="60" height="10" fill="#9CA3AF" rx="1"/>
                      <rect x="40" y="260" width="60" height="10" fill="#9CA3AF" rx="1"/>
                      <rect x="40" y="280" width="60" height="10" fill="#9CA3AF" rx="1"/>
                      <rect x="110" y="240" width="60" height="50" fill="#D1D5DB" stroke="#6B7280" rx="2"/>
                      <text x="140" y="270" textAnchor="middle" className="storage-label">Rack</text>
                      
                      {/* Pharmacy */}
                      <rect x="190" y="140" width="150" height="100" fill="#DCFCE7" stroke="#10B981" strokeWidth="2" rx="4" filter="url(#shadow)"/>
                      <text x="265" y="165" textAnchor="middle" className="room-label">💊 Pharmacy</text>
                      <rect x="200" y="185" width="130" height="40" fill="#BBF7D0" stroke="#10B981" rx="2"/>
                      <text x="265" y="210" textAnchor="middle" className="room-sublabel">Medicine Counter</text>
                    </g>
                    
                    {/* 1ST FLOOR - Middle Section */}
                    <g className="floor-group first-floor-rooms">
                      {/* ICU */}
                      <rect x="30" y="320" width="200" height="150" fill="#FEF9C3" stroke="#F59E0B" strokeWidth="2" rx="4" filter="url(#shadow)"/>
                      <text x="130" y="345" textAnchor="middle" className="room-label icu-label">🫀 ICU</text>
                      <text x="130" y="365" textAnchor="middle" className="room-sublabel">Intensive Care Unit</text>
                      {/* ICU beds with monitors */}
                      <rect x="40" y="380" width="40" height="25" fill="#fff" stroke="#F59E0B" rx="2"/>
                      <rect x="50" y="375" width="20" height="5" fill="#F59E0B"/>
                      <rect x="95" y="380" width="40" height="25" fill="#fff" stroke="#F59E0B" rx="2"/>
                      <rect x="105" y="375" width="20" height="5" fill="#F59E0B"/>
                      <rect x="150" y="380" width="40" height="25" fill="#fff" stroke="#F59E0B" rx="2"/>
                      <rect x="160" y="375" width="20" height="5" fill="#F59E0B"/>
                      <rect x="40" y="420" width="40" height="25" fill="#fff" stroke="#F59E0B" rx="2"/>
                      <rect x="95" y="420" width="40" height="25" fill="#fff" stroke="#F59E0B" rx="2"/>
                      <rect x="150" y="420" width="40" height="25" fill="#fff" stroke="#F59E0B" rx="2"/>
                      <rect x="200" y="380" width="20" height="70" fill="#FEF08A" stroke="#F59E0B" rx="2"/>
                      <text x="210" y="420" textAnchor="middle" className="equip-label" transform="rotate(-90, 210, 420)">Monitors</text>
                      
                      {/* General Ward */}
                      <rect x="240" y="250" width="100" height="220" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2" rx="4" filter="url(#shadow)"/>
                      <text x="290" y="275" textAnchor="middle" className="room-label">🛏️ General Ward</text>
                      {/* Ward beds */}
                      <rect x="250" y="295" width="35" height="18" fill="#fff" stroke="#6366F1" rx="2"/>
                      <rect x="295" y="295" width="35" height="18" fill="#fff" stroke="#6366F1" rx="2"/>
                      <rect x="250" y="325" width="35" height="18" fill="#fff" stroke="#6366F1" rx="2"/>
                      <rect x="295" y="325" width="35" height="18" fill="#fff" stroke="#6366F1" rx="2"/>
                      <rect x="250" y="355" width="35" height="18" fill="#fff" stroke="#6366F1" rx="2"/>
                      <rect x="295" y="355" width="35" height="18" fill="#fff" stroke="#6366F1" rx="2"/>
                      <rect x="250" y="385" width="35" height="18" fill="#fff" stroke="#6366F1" rx="2"/>
                      <rect x="295" y="385" width="35" height="18" fill="#fff" stroke="#6366F1" rx="2"/>
                      <rect x="250" y="420" width="80" height="40" fill="#C7D2FE" rx="2"/>
                      <text x="290" y="445" textAnchor="middle" className="room-count">8 Beds</text>
                    </g>
                    
                    {/* 2ND FLOOR - Right Side */}
                    <g className="floor-group second-floor-rooms">
                      {/* Surgery */}
                      <rect x="460" y="30" width="160" height="150" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="2" rx="4" filter="url(#shadow)"/>
                      <text x="540" y="55" textAnchor="middle" className="room-label surgery-label">🔪 Surgery</text>
                      <text x="540" y="75" textAnchor="middle" className="room-sublabel">Operating Theater</text>
                      {/* Surgery table */}
                      <ellipse cx="540" cy="120" rx="50" ry="25" fill="#DDD6FE" stroke="#8B5CF6" strokeWidth="2"/>
                      <text x="540" y="125" textAnchor="middle" className="table-label">OT Table</text>
                      <circle cx="480" cy="90" r="10" fill="#A78BFA"/>
                      <circle cx="600" cy="90" r="10" fill="#A78BFA"/>
                      <circle cx="480" cy="150" r="10" fill="#A78BFA"/>
                      <circle cx="600" cy="150" r="10" fill="#A78BFA"/>
                      
                      {/* Maternity */}
                      <rect x="630" y="30" width="140" height="150" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2" rx="4" filter="url(#shadow)"/>
                      <text x="700" y="55" textAnchor="middle" className="room-label">👶 Maternity</text>
                      <text x="700" y="75" textAnchor="middle" className="room-sublabel">Labor &amp; Delivery</text>
                      <rect x="640" y="95" width="50" height="30" fill="#fff" stroke="#EC4899" rx="2"/>
                      <rect x="710" y="95" width="50" height="30" fill="#fff" stroke="#EC4899" rx="2"/>
                      <rect x="640" y="135" width="50" height="30" fill="#fff" stroke="#EC4899" rx="2"/>
                      <rect x="710" y="135" width="50" height="30" fill="#fff" stroke="#EC4899" rx="2"/>
                      
                      {/* Pediatrics */}
                      <rect x="460" y="190" width="160" height="130" fill="#CFFAFE" stroke="#14B8A6" strokeWidth="2" rx="4" filter="url(#shadow)"/>
                      <text x="540" y="215" textAnchor="middle" className="room-label">🧒 Pediatrics</text>
                      <text x="540" y="235" textAnchor="middle" className="room-sublabel">Children's Ward</text>
                      <rect x="470" y="255" width="35" height="20" fill="#fff" stroke="#14B8A6" rx="2"/>
                      <rect x="515" y="255" width="35" height="20" fill="#fff" stroke="#14B8A6" rx="2"/>
                      <rect x="560" y="255" width="35" height="20" fill="#fff" stroke="#14B8A6" rx="2"/>
                      <rect x="470" y="285" width="35" height="20" fill="#fff" stroke="#14B8A6" rx="2"/>
                      <rect x="515" y="285" width="35" height="20" fill="#fff" stroke="#14B8A6" rx="2"/>
                      <rect x="560" y="285" width="35" height="20" fill="#fff" stroke="#14B8A6" rx="2"/>
                      
                      {/* Lab */}
                      <rect x="630" y="190" width="140" height="130" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" rx="4" filter="url(#shadow)"/>
                      <text x="700" y="215" textAnchor="middle" className="room-label">🔬 Laboratory</text>
                      <rect x="640" y="240" width="50" height="35" fill="#FDE68A" stroke="#D97706" rx="2"/>
                      <text x="665" y="262" textAnchor="middle" className="equip-label">🧪</text>
                      <rect x="700" y="240" width="60" height="35" fill="#FDE68A" stroke="#D97706" rx="2"/>
                      <text x="730" y="262" textAnchor="middle" className="equip-label">🖥️</text>
                      <rect x="640" y="285" width="120" height="25" fill="#FEF3C7" stroke="#D97706" rx="2"/>
                      <text x="700" y="302" textAnchor="middle" className="room-sublabel">Sample Counter</text>
                      
                      {/* Radiology */}
                      <rect x="460" y="330" width="150" height="140" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" rx="4" filter="url(#shadow)"/>
                      <text x="535" y="355" textAnchor="middle" className="room-label">📡 Radiology</text>
                      <text x="535" y="375" textAnchor="middle" className="room-sublabel">X-Ray &amp; MRI</text>
                      <rect x="475" y="395" width="60" height="50" fill="#BAE6FD" stroke="#0284C7" rx="4"/>
                      <text x="505" y="425" textAnchor="middle" className="equip-label">MRI</text>
                      <rect x="545" y="395" width="50" height="50" fill="#BAE6FD" stroke="#0284C7" rx="4"/>
                      <text x="570" y="425" textAnchor="middle" className="equip-label">X-Ray</text>
                      
                      {/* Cafeteria */}
                      <rect x="620" y="330" width="150" height="140" fill="#FEF7CD" stroke="#A3A31A" strokeWidth="2" rx="4" filter="url(#shadow)"/>
                      <text x="695" y="355" textAnchor="middle" className="room-label">🍽️ Cafeteria</text>
                      <circle cx="655" cy="400" r="20" fill="#fff" stroke="#A3A31A"/>
                      <circle cx="695" cy="400" r="20" fill="#fff" stroke="#A3A31A"/>
                      <circle cx="735" cy="400" r="20" fill="#fff" stroke="#A3A31A"/>
                      <circle cx="655" cy="445" r="20" fill="#fff" stroke="#A3A31A"/>
                      <circle cx="695" cy="445" r="20" fill="#fff" stroke="#A3A31A"/>
                      <circle cx="735" cy="445" r="20" fill="#fff" stroke="#A3A31A"/>
                    </g>
                    
                    {/* Equipment Markers */}
                    {filteredEquipment.map(eq => {
                      // Map equipment to realistic positions based on location
                      const locationMap = {
                        'Emergency': { x: 105, y: 100 },
                        'Reception': { x: 265, y: 95 },
                        'Storage': { x: 105, y: 260 },
                        'ICU': { x: 130, y: 400 },
                        'General Ward': { x: 290, y: 360 },
                        'Surgery': { x: 540, y: 120 },
                        'Maternity': { x: 700, y: 115 },
                        'Pediatrics': { x: 540, y: 270 },
                        'Laboratory': { x: 700, y: 250 },
                        'Radiology': { x: 535, y: 420 },
                        'Cafeteria': { x: 695, y: 420 }
                      }
                      const basePos = locationMap[eq.location] || { x: 400, y: 250 }
                      // Add small offset based on equipment id to prevent overlap
                      const offset = ((eq.id % 5) - 2) * 18
                      const yOffset = Math.floor((eq.id % 3) - 1) * 20
                      
                      return (
                        <g 
                          key={eq.id} 
                          className={`equipment-marker-svg ${eq.status} ${selectedEquipment?.id === eq.id ? 'selected' : ''}`}
                          onClick={() => setSelectedEquipment(eq)}
                          style={{ cursor: 'pointer' }}
                        >
                          <circle 
                            cx={basePos.x + offset} 
                            cy={basePos.y + yOffset} 
                            r={selectedEquipment?.id === eq.id ? 16 : 12}
                            fill={equipmentTypes[eq.type].color}
                            stroke={selectedEquipment?.id === eq.id ? '#fff' : 'rgba(255,255,255,0.5)'}
                            strokeWidth={selectedEquipment?.id === eq.id ? 3 : 2}
                            className="marker-circle"
                          />
                          <text 
                            x={basePos.x + offset} 
                            y={basePos.y + yOffset + 4} 
                            textAnchor="middle" 
                            className="marker-icon-svg"
                          >
                            {equipmentTypes[eq.type].icon}
                          </text>
                          {eq.status === 'maintenance' && (
                            <text x={basePos.x + offset + 10} y={basePos.y + yOffset - 8} className="marker-alert-svg">⚠️</text>
                          )}
                          {eq.type === 'oxygen' && eq.level < 30 && (
                            <circle cx={basePos.x + offset + 10} cy={basePos.y + yOffset - 10} r="5" fill="#EF4444"/>
                          )}
                        </g>
                      )
                    })}
                    
                    {/* Floor Labels on Corridor */}
                    <rect x="355" y="50" width="90" height="25" fill="#10B981" rx="4"/>
                    <text x="400" y="67" textAnchor="middle" className="floor-indicator">Ground Floor</text>
                    <rect x="355" y="300" width="90" height="25" fill="#3B82F6" rx="4"/>
                    <text x="400" y="317" textAnchor="middle" className="floor-indicator">1st Floor</text>
                    <rect x="355" y="450" width="90" height="25" fill="#8B5CF6" rx="4"/>
                    <text x="400" y="467" textAnchor="middle" className="floor-indicator">2nd Floor</text>
                    
                    {/* Compass Rose */}
                    <g transform="translate(750, 460)">
                      <circle r="18" fill="#fff" stroke="#94A3B8" strokeWidth="1"/>
                      <text y="-5" textAnchor="middle" className="compass-label">N</text>
                      <polygon points="0,-12 4,-4 -4,-4" fill="#EF4444"/>
                      <polygon points="0,12 4,4 -4,4" fill="#94A3B8"/>
                    </g>
                  </svg>
                </div>

                {/* Equipment Legend */}
                <div className="equipment-legend">
                  <h4>Equipment Types</h4>
                  <div className="legend-items">
                    {Object.entries(equipmentTypes).map(([key, value]) => (
                      <div key={key} className="legend-item" onClick={() => setEquipmentFilter(equipmentFilter === key ? 'all' : key)}>
                        <span className="legend-icon" style={{ backgroundColor: value.color }}>{value.icon}</span>
                        <span className="legend-label">{value.label}</span>
                        <span className="legend-count">{hospitalEquipment.filter(e => e.type === key).length}</span>
                      </div>
                    ))}
                  </div>
                  <div className="legend-status">
                    <h5>Status Indicators</h5>
                    <div className="status-item"><span className="status-dot available"></span> Available</div>
                    <div className="status-item"><span className="status-dot in-use"></span> In Use</div>
                    <div className="status-item"><span className="status-dot maintenance"></span> Maintenance</div>
                  </div>
                  <div className="legend-rooms">
                    <h5>Room Colors</h5>
                    <div className="room-legend-item"><span className="room-color" style={{background: '#FEE2E2'}}></span> Emergency</div>
                    <div className="room-legend-item"><span className="room-color" style={{background: '#FEF9C3'}}></span> ICU</div>
                    <div className="room-legend-item"><span className="room-color" style={{background: '#F3E8FF'}}></span> Surgery</div>
                    <div className="room-legend-item"><span className="room-color" style={{background: '#E0E7FF'}}></span> General Ward</div>
                    <div className="room-legend-item"><span className="room-color" style={{background: '#FCE7F3'}}></span> Maternity</div>
                    <div className="room-legend-item"><span className="room-color" style={{background: '#CFFAFE'}}></span> Pediatrics</div>
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
