import { useState, useEffect } from 'react';
import { DemoVideo } from '../DemoVideo';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import './HomePage.css';

function HomePage({ onNavigate }) {
  const [animatedStats, setAnimatedStats] = useState({
    timeSaved: 0,
    profitIncrease: 0,
    efficiency: 0,
    ordersProcessed: 0,
  });

  // Animate statistics on mount
  useEffect(() => {
    const targets = {
      timeSaved: 42,
      profitIncrease: 28,
      efficiency: 35,
      ordersProcessed: 15000,
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        timeSaved: Math.round(targets.timeSaved * easeOut),
        profitIncrease: Math.round(targets.profitIncrease * easeOut),
        efficiency: Math.round(targets.efficiency * easeOut),
        ordersProcessed: Math.round(targets.ordersProcessed * easeOut),
      });

      if (currentStep >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: '🗺️',
      title: 'Facility Map View',
      description: 'Aerial view of the entire warehouse complex including loading docks, parking areas, security booth, and office wing.',
      benefits: ['Bird\'s eye view', 'Quick orientation', 'Emergency exits visible'],
    },
    {
      icon: '📋',
      title: '2D Floor Plan',
      description: 'Interactive floor plan showing all racks, sections, and product locations with real-time path visualization.',
      benefits: ['Rack-level detail', 'Section colors', 'Live path drawing'],
    },
    {
      icon: '🎮',
      title: '3D Warehouse View',
      description: 'Immersive 3D visualization with camera controls for better spatial understanding of product locations.',
      benefits: ['360° rotation', 'Zoom controls', 'Realistic shelves'],
    },
    {
      icon: '🔍',
      title: 'Smart Product Search',
      description: 'Search by product name, SKU, or category with instant filtering and auto-complete suggestions.',
      benefits: ['Instant results', 'Category filters', 'SKU lookup'],
    },
    {
      icon: '🧭',
      title: 'A* Pathfinding',
      description: 'Advanced algorithm calculates the shortest path to any product, saving time and reducing worker fatigue.',
      benefits: ['Optimal routes', 'Obstacle avoidance', 'Multi-stop planning'],
    },
    {
      icon: '📍',
      title: 'Turn-by-Turn Navigation',
      description: 'Step-by-step directions guiding workers directly to products with estimated walking time.',
      benefits: ['Clear directions', 'Time estimates', 'Distance shown'],
    },
    {
      icon: '🚶',
      title: 'Live Worker Tracking',
      description: 'Animated worker position updates showing real-time movement along the calculated path.',
      benefits: ['Real-time updates', 'Progress tracking', 'Animation controls'],
    },
    {
      icon: '📊',
      title: 'Inventory Dashboard',
      description: 'Complete rack-by-rack inventory overview with stock levels, categories, and low-stock alerts.',
      benefits: ['Stock visibility', 'Low stock alerts', 'Category grouping'],
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Warehouse Manager',
      company: 'MegaStore Inc.',
      quote: 'WareTrack reduced our average pick time by 40%. Workers can now locate any product in seconds.',
      avatar: '👩‍💼',
    },
    {
      name: 'Mike Chen',
      role: 'Operations Director',
      company: 'FastShip Logistics',
      quote: 'The 3D view is a game-changer for training new employees. They understand the layout instantly.',
      avatar: '👨‍💼',
    },
    {
      name: 'Lisa Rodriguez',
      role: 'CEO',
      company: 'QuickPick Fulfillment',
      quote: 'ROI was visible within the first month. We process 35% more orders with the same team.',
      avatar: '👩‍💻',
    },
  ];

  return (
    <div className="home-page">
      {/* Image Carousel */}
      <ImageCarousel />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🚀 Next-Gen Warehouse Management</div>
          <h1>Navigate Your Warehouse <span className="gradient-text">Smarter & Faster</span></h1>
          <p className="hero-description">
            AI-powered indoor navigation system with 3D visualization, real-time pathfinding, 
            and comprehensive inventory tracking. Reduce picking time by 42% and boost profits.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => onNavigate?.('dashboard')}>
              <span>📦</span> Explore Dashboard
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">{animatedStats.timeSaved}%</span>
              <span className="stat-text">Time Saved</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{animatedStats.profitIncrease}%</span>
              <span className="stat-text">Profit Increase</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{animatedStats.efficiency}%</span>
              <span className="stat-text">More Efficient</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{animatedStats.ordersProcessed.toLocaleString()}+</span>
              <span className="stat-text">Orders/Month</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="warehouse-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span><span></span><span></span>
              </div>
              <span>WareTrack Dashboard</span>
            </div>
            <div className="preview-content">
              <div className="mini-warehouse">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="mini-rack" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="rack-shelves">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                ))}
                <div className="mini-worker">👷</div>
                <div className="mini-path"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="demo-video-section">
        <DemoVideo inline={true} />
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-badge">✨ Features</span>
          <h2>Everything You Need for Modern Warehousing</h2>
          <p>Comprehensive tools designed to optimize every aspect of warehouse operations</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul className="feature-benefits">
                {feature.benefits.map((benefit, i) => (
                  <li key={i}>✓ {benefit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="section-badge">💬 Testimonials</span>
          <h2>Trusted by Industry Leaders</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <p>"{item.quote}"</p>
              </div>
              <div className="testimonial-author">
                <span className="author-avatar">{item.avatar}</span>
                <div className="author-info">
                  <span className="author-name">{item.name}</span>
                  <span className="author-role">{item.role}, {item.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Warehouse?</h2>
          <p>Start optimizing your operations today with WareTrack</p>
          <button className="btn-primary large" onClick={() => onNavigate?.('dashboard')}>
            <span>🚀</span> Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
