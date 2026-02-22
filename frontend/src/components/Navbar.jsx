import { useState } from 'react'
import AIAssistant from './AIAssistant'
import EmergencyAlerts from './EmergencyAlerts'
import StockNotifications from './StockNotifications'
import ExpiryDashboard from './ExpiryDashboard'
import './Navbar.css'

function Navbar({ currentPage, onNavigate }) {
  const [showAI, setShowAI] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showExpiry, setShowExpiry] = useState(false)

  return (
    <>
      <header className="navbar">
        <div className="logo" onClick={() => onNavigate?.('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon" role="img" aria-label="warehouse">&#128230;</span>
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
        </nav>
        <div className="nav-actions">
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
          <div className="user-menu">
            <span className="user-avatar">WK</span>
            <span className="user-name">Worker #142</span>
          </div>
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
    </>
  )
}

export default Navbar
