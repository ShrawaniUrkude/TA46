import { useState, useEffect } from 'react'
import AIAssistant from './AIAssistant'
import EmergencyAlerts from './EmergencyAlerts'
import StockNotifications from './StockNotifications'
import ExpiryDashboard from './ExpiryDashboard'
import CarbonDashboard from './CarbonDashboard'
import WorkerAuth from './WorkerAuth'
import './Navbar.css'

function Navbar({ currentPage, onNavigate }) {
  const [showAI, setShowAI] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showExpiry, setShowExpiry] = useState(false)
  const [showCarbon, setShowCarbon] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [worker, setWorker] = useState(null)

  // Check for existing login on mount
  useEffect(() => {
    const savedWorker = localStorage.getItem('worker')
    if (savedWorker) {
      setWorker(JSON.parse(savedWorker))
    }
  }, [])

  const handleLogin = (workerData) => {
    setWorker(workerData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('worker')
    setWorker(null)
  }

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'WK'
  }

  return (
    <>
      <header className="navbar">
        <div className="logo" onClick={() => onNavigate?.('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-text">WareTrack</span>
        </div>
        <nav className="nav-links">
          <a 
            href="#" 
            className={currentPage === 'home' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}
          >
            Home
          </a>
          <a 
            href="#" 
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onNavigate?.('dashboard'); }}
          >
            Dashboard
          </a>
          <a 
            href="#" 
            className={currentPage === 'analytics' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onNavigate?.('analytics'); }}
          >
            Analytics
          </a>
          <a 
            href="#" 
            className={currentPage === 'hospital' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onNavigate?.('hospital'); }}
          >
            Hospital
          </a>
        </nav>
        <div className="nav-actions">
          <button 
            className="carbon-dashboard-btn"
            onClick={() => setShowCarbon(true)}
            title="Carbon Footprint Monitor"
          >
            <span className="carbon-btn-icon">🌍</span>
            <span className="carbon-badge">Eco</span>
          </button>
          <button 
            className="expiry-dashboard-btn"
            onClick={() => setShowExpiry(true)}
            title="Expiry Dashboard"
          >
            <span className="expiry-btn-icon">⏰</span>
            <span className="expiry-badge">2</span>
          </button>
          <button 
            className="emergency-alert-btn"
            onClick={() => setShowEmergency(true)}
            title="Emergency Alert System"
          >
            <span className="emergency-btn-icon">🚨</span>
            <span className="emergency-badge">3</span>
          </button>
          <button 
            className="ai-assistant-btn"
            onClick={() => setShowAI(true)}
            title="AI Assistant - Product Insights"
          >
            <span className="ai-btn-icon">🤖</span>
            <span className="ai-btn-label">AI</span>
          </button>
          <button className="notification-btn" onClick={() => setShowNotifications(true)}>
            <span role="img" aria-label="bell">&#128276;</span>
            <span className="notification-badge">5</span>
          </button>
          {worker ? (
            <div className="user-menu">
              <span className="user-avatar">{getInitials(worker.name)}</span>
              <span className="user-name">{worker.name}</span>
              <span className="user-id">{worker.workerId}</span>
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                🚪
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => setShowAuth(true)}>
              <span>👷</span> Login
            </button>
          )}
        </div>
      </header>

      {/* Emergency Alerts Panel */}
      <EmergencyAlerts isOpen={showEmergency} onClose={() => setShowEmergency(false)} />

      {/* AI Assistant Panel */}
      <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} />

      {/* Stock Notifications Panel */}
      <StockNotifications isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Expiry Dashboard Panel */}
      <ExpiryDashboard isOpen={showExpiry} onClose={() => setShowExpiry(false)} />

      {/* Carbon Footprint Dashboard */}
      <CarbonDashboard isOpen={showCarbon} onClose={() => setShowCarbon(false)} />

      {/* Worker Authentication */}
      {showAuth && (
        <WorkerAuth 
          onLogin={handleLogin} 
          onClose={() => setShowAuth(false)} 
        />
      )}
    </>
  )
}

export default Navbar
