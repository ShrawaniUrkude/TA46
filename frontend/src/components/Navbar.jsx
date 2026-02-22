import './Navbar.css'

function Navbar({ currentPage, onNavigate }) {
  return (
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
        <a href="#">Products</a>
        <a 
          href="#" 
          className={currentPage === 'analytics' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); onNavigate?.('analytics'); }}
        >
          Analytics
        </a>
      </nav>
      <div className="nav-actions">
        <button className="notification-btn">
          <span role="img" aria-label="bell">&#128276;</span>
          <span className="notification-badge">5</span>
        </button>
        <div className="user-menu">
          <span className="user-avatar">WK</span>
          <span className="user-name">Worker #142</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar
