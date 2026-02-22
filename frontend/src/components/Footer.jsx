import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>📦 WareTrack</h3>
          <p>Smart warehouse management with indoor product tracking. Find any item in seconds.</p>
        </div>
        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li><a href="#">Product Locator</a></li>
            <li><a href="#">Path Navigation</a></li>
            <li><a href="#">Inventory Management</a></li>
            <li><a href="#">Analytics</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li>support@waretrack.io</li>
            <li>+1 (800) 555-WARE</li>
            <li><a href="#">Help Center</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <div className="social-links">
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 WareTrack. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
