import { useState, useMemo, useEffect } from 'react'
import './CarbonDashboard.css'

function CarbonDashboard({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('daily')
  const [alertsEnabled, setAlertsEnabled] = useState(true)

  // Emission factors (kg CO₂ per unit)
  const emissionFactors = {
    electricity: 0.82,  // per kWh
    diesel: 2.68,       // per liter
    petrol: 2.31,       // per liter
    lpg: 1.51,          // per liter
    waste: 0.5          // per kg
  }

  // Mock data for carbon sources
  const [carbonData] = useState({
    daily: {
      electricity: { units: 145, cost: 1015 },      // kWh - Solar panels cover 60%
      fuel: { diesel: 18, petrol: 6, lpg: 4 },      // liters - Electric fleet transition
      transportation: { trips: 8, distance: 165 },  // km - Optimized routes
      waste: { generated: 38, recycled: 36 }        // kg - 95% recycling rate
    },
    weekly: {
      electricity: { units: 1015, cost: 7105 },
      fuel: { diesel: 126, petrol: 42, lpg: 28 },
      transportation: { trips: 56, distance: 1155 },
      waste: { generated: 266, recycled: 253 }
    },
    monthly: {
      electricity: { units: 4350, cost: 30450 },
      fuel: { diesel: 540, petrol: 180, lpg: 120 },
      transportation: { trips: 240, distance: 4950 },
      waste: { generated: 1140, recycled: 1083 }
    }
  })

  // Equipment carbon data - Eco-optimized fleet
  const [equipment] = useState([
    { id: 1, name: 'Electric Forklift #1', type: 'electric', usage: 8, unit: 'hours', emission: 13.1 },
    { id: 2, name: 'Electric Forklift #2', type: 'electric', usage: 6, unit: 'hours', emission: 9.8 },
    { id: 3, name: 'Smart Cooling System', type: 'electric', usage: 12, unit: 'hours', emission: 19.7 },
    { id: 4, name: 'LED Dock Lights', type: 'electric', usage: 16, unit: 'hours', emission: 6.6 },
    { id: 5, name: 'Conveyor Belt System', type: 'electric', usage: 10, unit: 'hours', emission: 16.4 },
    { id: 6, name: 'Electric Delivery Van', type: 'electric', usage: 45, unit: 'km', emission: 8.1 },
    { id: 7, name: 'Solar Battery Storage', type: 'solar', usage: 24, unit: 'hours', emission: 0 }
  ])

  // Green optimization suggestions
  const greenSuggestions = [
    {
      id: 1,
      title: 'Switch to Electric Forklifts',
      description: 'Replace diesel forklift #2 with electric model',
      impact: 'Save 32 kg CO₂/day',
      savings: '₹15,000/month',
      priority: 'high',
      icon: '🔋'
    },
    {
      id: 2,
      title: 'Optimize Delivery Routes',
      description: 'AI-suggested route reduces distance by 18%',
      impact: 'Save 45 kg CO₂/day',
      savings: '₹8,500/month',
      priority: 'high',
      icon: '🗺️'
    },
    {
      id: 3,
      title: 'Install Solar Panels',
      description: 'Cover 40% of electricity from solar',
      impact: 'Save 148 kg CO₂/day',
      savings: '₹45,000/month',
      priority: 'medium',
      icon: '☀️'
    },
    {
      id: 4,
      title: 'LED Lighting Upgrade',
      description: 'Replace warehouse lights with LED',
      impact: 'Save 25 kg CO₂/day',
      savings: '₹12,000/month',
      priority: 'medium',
      icon: '💡'
    },
    {
      id: 5,
      title: 'Waste Composting Program',
      description: 'Compost organic waste instead of disposal',
      impact: 'Save 15 kg CO₂/day',
      savings: '₹5,000/month',
      priority: 'low',
      icon: '🌱'
    },
    {
      id: 6,
      title: 'Smart Cooling Schedule',
      description: 'AI-optimized cooling reduces runtime by 20%',
      impact: 'Save 35 kg CO₂/day',
      savings: '₹18,000/month',
      priority: 'high',
      icon: '❄️'
    }
  ]

  // Calculate emissions
  const emissions = useMemo(() => {
    const data = carbonData[timeRange]
    
    const electricityEmission = data.electricity.units * emissionFactors.electricity
    const dieselEmission = data.fuel.diesel * emissionFactors.diesel
    const petrolEmission = data.fuel.petrol * emissionFactors.petrol
    const lpgEmission = data.fuel.lpg * emissionFactors.lpg
    const wasteEmission = (data.waste.generated - data.waste.recycled) * emissionFactors.waste

    const totalFuel = dieselEmission + petrolEmission + lpgEmission
    const total = electricityEmission + totalFuel + wasteEmission

    return {
      electricity: electricityEmission,
      fuel: totalFuel,
      diesel: dieselEmission,
      petrol: petrolEmission,
      lpg: lpgEmission,
      waste: wasteEmission,
      total,
      breakdown: [
        { source: 'Electricity', value: electricityEmission, color: '#3B82F6', icon: '⚡' },
        { source: 'Diesel', value: dieselEmission, color: '#EF4444', icon: '⛽' },
        { source: 'Petrol', value: petrolEmission, color: '#F59E0B', icon: '🛢️' },
        { source: 'LPG', value: lpgEmission, color: '#8B5CF6', icon: '🔥' },
        { source: 'Waste', value: wasteEmission, color: '#6B7280', icon: '🗑️' }
      ]
    }
  }, [carbonData, timeRange, emissionFactors])

  // Carbon limits and alerts (Green Certified Warehouse Targets)
  const carbonLimits = {
    daily: 500,
    weekly: 3500,
    monthly: 15000
  }

  const currentLimit = carbonLimits[timeRange]
  const limitPercentage = (emissions.total / currentLimit) * 100
  const isOverLimit = emissions.total > currentLimit

  // Eco score calculation (0-100)
  const ecoScore = useMemo(() => {
    const baseScore = 100 - Math.min(limitPercentage, 100)
    const recycleBonus = (carbonData[timeRange].waste.recycled / carbonData[timeRange].waste.generated) * 20
    return Math.round(Math.min(baseScore + recycleBonus, 100))
  }, [limitPercentage, carbonData, timeRange])

  // Alert simulation
  useEffect(() => {
    if (alertsEnabled && isOpen && isOverLimit) {
      console.log(`🚨 Carbon Alert: Emissions exceed ${timeRange} limit by ${(emissions.total - currentLimit).toFixed(1)} kg CO₂`)
    }
  }, [alertsEnabled, isOpen, isOverLimit, emissions.total, currentLimit, timeRange])

  const getTimeLabel = () => {
    switch (timeRange) {
      case 'daily': return "Today's"
      case 'weekly': return "This Week's"
      case 'monthly': return "This Month's"
      default: return ''
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444'
      case 'medium': return '#F59E0B'
      case 'low': return '#10B981'
      default: return '#6B7280'
    }
  }

  if (!isOpen) return null

  return (
    <div className="carbon-dashboard-overlay">
      <div className="carbon-dashboard-panel">
        {/* Header */}
        <div className="carbon-header">
          <div className="carbon-title-section">
            <span className="carbon-icon">🌍</span>
            <div>
              <h2 className="carbon-title">Carbon Footprint Monitor</h2>
              <p className="carbon-subtitle">Warehouse sustainability & emission tracking</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="alert-toggle">
              <span>Alerts</span>
              <button 
                className={`toggle-switch ${alertsEnabled ? 'active' : ''}`}
                onClick={() => setAlertsEnabled(!alertsEnabled)}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="time-range-bar">
          <button 
            className={`time-btn ${timeRange === 'daily' ? 'active' : ''}`}
            onClick={() => setTimeRange('daily')}
          >
            Daily
          </button>
          <button 
            className={`time-btn ${timeRange === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`time-btn ${timeRange === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </button>
        </div>

        {/* Main Stats */}
        <div className="carbon-main-stats">
          <div className={`total-emission-card ${isOverLimit ? 'over-limit' : ''}`}>
            <div className="emission-header">
              <span className="emission-label">{getTimeLabel()} Total Emission</span>
              {isOverLimit && <span className="limit-warning">⚠️ Over Limit!</span>}
            </div>
            <div className="emission-value">
              <span className="big-number">{emissions.total.toFixed(0)}</span>
              <span className="unit">kg CO₂</span>
            </div>
            <div className="limit-bar">
              <div 
                className={`limit-progress ${isOverLimit ? 'over' : ''}`}
                style={{ width: `${Math.min(limitPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="limit-info">
              <span>{limitPercentage.toFixed(0)}% of {currentLimit} kg limit</span>
            </div>
          </div>

          <div className="eco-score-card">
            <div className="eco-score-ring">
              <svg viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke={ecoScore >= 70 ? '#10B981' : ecoScore >= 40 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="8"
                  strokeDasharray={`${ecoScore * 2.83} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="eco-score-value">
                <span className="score">{ecoScore}</span>
                <span className="label">Eco Score</span>
              </div>
            </div>
            <div className="eco-rating">
              {ecoScore >= 80 ? '🌟 Excellent' : ecoScore >= 60 ? '👍 Good' : ecoScore >= 40 ? '⚠️ Fair' : '❌ Poor'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="carbon-tabs">
          <button 
            className={`carbon-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span> Overview
          </button>
          <button 
            className={`carbon-tab ${activeTab === 'sources' ? 'active' : ''}`}
            onClick={() => setActiveTab('sources')}
          >
            <span>⚡</span> Sources
          </button>
          <button 
            className={`carbon-tab ${activeTab === 'equipment' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipment')}
          >
            <span>🏭</span> Equipment
          </button>
          <button 
            className={`carbon-tab ${activeTab === 'optimize' ? 'active' : ''}`}
            onClick={() => setActiveTab('optimize')}
          >
            <span>🌱</span> Green Optimize
          </button>
        </div>

        {/* Content */}
        <div className="carbon-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              {/* Emission Breakdown */}
              <div className="breakdown-section">
                <h3>📈 Emission Breakdown</h3>
                <div className="breakdown-chart">
                  {emissions.breakdown.map((item, index) => (
                    <div key={index} className="breakdown-item">
                      <div className="breakdown-header">
                        <span className="source-icon">{item.icon}</span>
                        <span className="source-name">{item.source}</span>
                        <span className="source-value">{item.value.toFixed(1)} kg</span>
                      </div>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill"
                          style={{ 
                            width: `${(item.value / emissions.total) * 100}%`,
                            backgroundColor: item.color 
                          }}
                        ></div>
                      </div>
                      <span className="breakdown-percent">
                        {((item.value / emissions.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="quick-stats">
                <div className="quick-stat electricity">
                  <span className="stat-icon">⚡</span>
                  <div className="stat-info">
                    <span className="stat-value">{carbonData[timeRange].electricity.units}</span>
                    <span className="stat-label">kWh Used</span>
                  </div>
                </div>
                <div className="quick-stat fuel">
                  <span className="stat-icon">⛽</span>
                  <div className="stat-info">
                    <span className="stat-value">{carbonData[timeRange].fuel.diesel + carbonData[timeRange].fuel.petrol}</span>
                    <span className="stat-label">Liters Fuel</span>
                  </div>
                </div>
                <div className="quick-stat transport">
                  <span className="stat-icon">🚚</span>
                  <div className="stat-info">
                    <span className="stat-value">{carbonData[timeRange].transportation.distance}</span>
                    <span className="stat-label">km Traveled</span>
                  </div>
                </div>
                <div className="quick-stat waste">
                  <span className="stat-icon">♻️</span>
                  <div className="stat-info">
                    <span className="stat-value">{Math.round((carbonData[timeRange].waste.recycled / carbonData[timeRange].waste.generated) * 100)}%</span>
                    <span className="stat-label">Recycled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="sources-content">
              <div className="source-card electricity-card">
                <div className="source-header">
                  <span className="source-icon-large">⚡</span>
                  <div>
                    <h4>Electricity Usage</h4>
                    <p>Power consumption across warehouse</p>
                  </div>
                </div>
                <div className="source-stats">
                  <div className="source-stat">
                    <span className="value">{carbonData[timeRange].electricity.units}</span>
                    <span className="label">kWh</span>
                  </div>
                  <div className="source-stat highlight">
                    <span className="value">{emissions.electricity.toFixed(0)}</span>
                    <span className="label">kg CO₂</span>
                  </div>
                  <div className="source-stat">
                    <span className="value">₹{carbonData[timeRange].electricity.cost}</span>
                    <span className="label">Cost</span>
                  </div>
                </div>
                <div className="emission-factor">
                  Factor: {emissionFactors.electricity} kg CO₂/kWh
                </div>
              </div>

              <div className="source-card fuel-card">
                <div className="source-header">
                  <span className="source-icon-large">⛽</span>
                  <div>
                    <h4>Fuel Consumption</h4>
                    <p>Forklifts, trucks & generators</p>
                  </div>
                </div>
                <div className="fuel-breakdown">
                  <div className="fuel-type">
                    <span className="fuel-name">🛢️ Diesel</span>
                    <span className="fuel-amount">{carbonData[timeRange].fuel.diesel}L</span>
                    <span className="fuel-emission">{emissions.diesel.toFixed(0)} kg CO₂</span>
                  </div>
                  <div className="fuel-type">
                    <span className="fuel-name">⛽ Petrol</span>
                    <span className="fuel-amount">{carbonData[timeRange].fuel.petrol}L</span>
                    <span className="fuel-emission">{emissions.petrol.toFixed(0)} kg CO₂</span>
                  </div>
                  <div className="fuel-type">
                    <span className="fuel-name">🔥 LPG</span>
                    <span className="fuel-amount">{carbonData[timeRange].fuel.lpg}L</span>
                    <span className="fuel-emission">{emissions.lpg.toFixed(0)} kg CO₂</span>
                  </div>
                </div>
                <div className="source-stat total">
                  <span className="value">{emissions.fuel.toFixed(0)}</span>
                  <span className="label">Total kg CO₂</span>
                </div>
              </div>

              <div className="source-card transport-card">
                <div className="source-header">
                  <span className="source-icon-large">🚚</span>
                  <div>
                    <h4>Transportation</h4>
                    <p>Delivery & logistics</p>
                  </div>
                </div>
                <div className="source-stats">
                  <div className="source-stat">
                    <span className="value">{carbonData[timeRange].transportation.trips}</span>
                    <span className="label">Trips</span>
                  </div>
                  <div className="source-stat">
                    <span className="value">{carbonData[timeRange].transportation.distance}</span>
                    <span className="label">km</span>
                  </div>
                  <div className="source-stat highlight">
                    <span className="value">{(carbonData[timeRange].transportation.distance * 0.15).toFixed(0)}</span>
                    <span className="label">kg CO₂</span>
                  </div>
                </div>
              </div>

              <div className="source-card waste-card">
                <div className="source-header">
                  <span className="source-icon-large">🗑️</span>
                  <div>
                    <h4>Waste Generation</h4>
                    <p>Expired & damaged items</p>
                  </div>
                </div>
                <div className="source-stats">
                  <div className="source-stat">
                    <span className="value">{carbonData[timeRange].waste.generated}</span>
                    <span className="label">kg Generated</span>
                  </div>
                  <div className="source-stat eco">
                    <span className="value">{carbonData[timeRange].waste.recycled}</span>
                    <span className="label">kg Recycled</span>
                  </div>
                  <div className="source-stat highlight">
                    <span className="value">{emissions.waste.toFixed(0)}</span>
                    <span className="label">kg CO₂</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="equipment-content">
              <div className="equipment-header">
                <h3>🏭 Equipment Emissions</h3>
                <p>Individual equipment carbon footprint tracking</p>
              </div>
              <div className="equipment-list">
                {equipment.map(item => (
                  <div key={item.id} className={`equipment-item ${item.type}`}>
                    <div className="equipment-info">
                      <span className="equipment-icon">
                        {item.type === 'electric' ? '🔋' : '⛽'}
                      </span>
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.usage} {item.unit} • {item.type === 'electric' ? 'Electric' : 'Diesel'}</p>
                      </div>
                    </div>
                    <div className="equipment-emission">
                      <span className="emission-value">{item.emission.toFixed(1)}</span>
                      <span className="emission-unit">kg CO₂</span>
                    </div>
                    <div className={`equipment-badge ${item.type}`}>
                      {item.type === 'electric' ? '🌱 Low Emission' : '⚠️ High Emission'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="equipment-summary">
                <div className="summary-item">
                  <span className="summary-icon">🔋</span>
                  <div>
                    <span className="summary-value">
                      {equipment.filter(e => e.type === 'electric').reduce((sum, e) => sum + e.emission, 0).toFixed(0)} kg
                    </span>
                    <span className="summary-label">Electric Equipment</span>
                  </div>
                </div>
                <div className="summary-item">
                  <span className="summary-icon">⛽</span>
                  <div>
                    <span className="summary-value">
                      {equipment.filter(e => e.type === 'diesel').reduce((sum, e) => sum + e.emission, 0).toFixed(0)} kg
                    </span>
                    <span className="summary-label">Diesel Equipment</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'optimize' && (
            <div className="optimize-content">
              <div className="optimize-header">
                <h3>🌱 Green Optimization System</h3>
                <p>AI-powered suggestions to reduce carbon footprint</p>
              </div>
              <div className="suggestions-grid">
                {greenSuggestions.map(suggestion => (
                  <div key={suggestion.id} className={`green-suggestion priority-${suggestion.priority}`}>
                    <div className="suggestion-icon">{suggestion.icon}</div>
                    <div className="suggestion-main">
                      <h4>{suggestion.title}</h4>
                      <p>{suggestion.description}</p>
                      <div className="suggestion-impacts">
                        <span className="impact-badge eco">
                          🌍 {suggestion.impact}
                        </span>
                        <span className="impact-badge savings">
                          💰 {suggestion.savings}
                        </span>
                      </div>
                    </div>
                    <div className="suggestion-action">
                      <span 
                        className="priority-tag"
                        style={{ backgroundColor: getPriorityColor(suggestion.priority) }}
                      >
                        {suggestion.priority.toUpperCase()}
                      </span>
                      <button className="implement-btn">Implement</button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Positive Impact Analysis */}
              <div className="positive-impact-section">
                <div className="impact-header">
                  <span className="impact-icon">🏆</span>
                  <div>
                    <h4>WareTrack Sustainability Impact</h4>
                    <p>Your warehouse is making a difference!</p>
                  </div>
                </div>

                <div className="achievement-cards">
                  <div className="achievement-card green">
                    <div className="achievement-icon">✅</div>
                    <div className="achievement-content">
                      <span className="achievement-value">2,450 kg</span>
                      <span className="achievement-label">CO₂ Reduced This Month</span>
                      <span className="achievement-comparison">↓ 28% vs last month</span>
                    </div>
                  </div>
                  <div className="achievement-card blue">
                    <div className="achievement-icon">🌳</div>
                    <div className="achievement-content">
                      <span className="achievement-value">~120 Trees</span>
                      <span className="achievement-label">Equivalent Saved This Year</span>
                      <span className="achievement-comparison">On track to plant 150 trees</span>
                    </div>
                  </div>
                  <div className="achievement-card gold">
                    <div className="achievement-icon">⚡</div>
                    <div className="achievement-content">
                      <span className="achievement-value">35%</span>
                      <span className="achievement-label">Energy Efficiency Improved</span>
                      <span className="achievement-comparison">Since WareTrack adoption</span>
                    </div>
                  </div>
                </div>

                <div className="impact-summary">
                  <div className="summary-header">
                    <span>🌟</span>
                    <h5>WareTrack Green Achievements</h5>
                  </div>
                  <div className="impact-highlights">
                    <div className="highlight-item">
                      <span className="highlight-icon">🔋</span>
                      <div className="highlight-text">
                        <strong>Smart Route Optimization</strong> reduced fuel consumption by <span className="positive">18%</span>, saving 850L of diesel monthly
                      </div>
                    </div>
                    <div className="highlight-item">
                      <span className="highlight-icon">♻️</span>
                      <div className="highlight-text">
                        <strong>Waste Management System</strong> achieved <span className="positive">72% recycling rate</span>, diverting 960kg from landfills
                      </div>
                    </div>
                    <div className="highlight-item">
                      <span className="highlight-icon">📊</span>
                      <div className="highlight-text">
                        <strong>Real-time Monitoring</strong> prevented <span className="positive">₹2.8L worth</span> of product expiry through timely alerts
                      </div>
                    </div>
                    <div className="highlight-item">
                      <span className="highlight-icon">🚚</span>
                      <div className="highlight-text">
                        <strong>Efficient Logistics</strong> reduced delivery trips by <span className="positive">22%</span> through smart batching
                      </div>
                    </div>
                  </div>
                </div>

                <div className="eco-badge-section">
                  <div className="eco-certification">
                    <div className="cert-badge">
                      <span className="cert-icon">🏅</span>
                      <span className="cert-label">ECO CERTIFIED</span>
                    </div>
                    <div className="cert-info">
                      <span className="cert-title">Green Warehouse Level 3</span>
                      <span className="cert-desc">Your warehouse ranks in top 15% for sustainability</span>
                    </div>
                  </div>
                  <div className="net-zero-progress">
                    <div className="nz-header">
                      <span>🎯 Net Zero Progress 2030</span>
                      <span className="nz-percent">68%</span>
                    </div>
                    <div className="nz-bar">
                      <div className="nz-fill" style={{ width: '68%' }}></div>
                    </div>
                    <span className="nz-status">On track to achieve carbon neutrality by 2028!</span>
                  </div>
                </div>

                <div className="final-message">
                  <div className="message-content">
                    <span className="message-icon">🌍</span>
                    <div>
                      <h5>Thank You for Going Green!</h5>
                      <p>Through WareTrack's intelligent monitoring, your warehouse has contributed to a cleaner planet. Together, we've prevented <strong>29.4 tonnes of CO₂</strong> emissions this year – equivalent to taking <strong>6 cars off the road</strong>!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="carbon-footer">
          <div className="footer-info">
            <span className="info-icon">🌱</span>
            <span>Committed to Net Zero by 2030 • Track your sustainability goals</span>
          </div>
          <button className="export-btn">
            <span>📊</span> Export Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default CarbonDashboard
