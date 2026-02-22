import { useState, useEffect } from 'react';
import './Analytics.css';

function Analytics() {
  const [timeRange, setTimeRange] = useState('month');
  const [animatedValues, setAnimatedValues] = useState({
    timeSaved: 0,
    costSaved: 0,
    ordersProcessed: 0,
    efficiency: 0,
  });

  // Animate values on mount
  useEffect(() => {
    const targets = {
      timeSaved: 2100,
      costSaved: 540000,
      ordersProcessed: 180000,
      efficiency: 92,
    };

    const duration = 1500;
    const steps = 50;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        timeSaved: Math.round(targets.timeSaved * easeOut),
        costSaved: Math.round(targets.costSaved * easeOut),
        ordersProcessed: Math.round(targets.ordersProcessed * easeOut),
        efficiency: Math.round(targets.efficiency * easeOut),
      });

      if (currentStep >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Time savings data
  const timeSavingsData = {
    daily: [
      { label: 'Mon', beforeMinutes: 4.2, afterMinutes: 2.4 },
      { label: 'Tue', beforeMinutes: 4.5, afterMinutes: 2.5 },
      { label: 'Wed', beforeMinutes: 4.1, afterMinutes: 2.3 },
      { label: 'Thu', beforeMinutes: 4.8, afterMinutes: 2.6 },
      { label: 'Fri', beforeMinutes: 4.3, afterMinutes: 2.4 },
      { label: 'Sat', beforeMinutes: 5.0, afterMinutes: 2.8 },
      { label: 'Sun', beforeMinutes: 3.8, afterMinutes: 2.2 },
    ],
    weekly: [
      { label: 'Week 1', beforeMinutes: 4.2, afterMinutes: 2.5 },
      { label: 'Week 2', beforeMinutes: 4.4, afterMinutes: 2.4 },
      { label: 'Week 3', beforeMinutes: 4.1, afterMinutes: 2.3 },
      { label: 'Week 4', beforeMinutes: 4.6, afterMinutes: 2.5 },
    ],
    month: [
      { label: 'Jan', beforeMinutes: 5.2, afterMinutes: 3.1 },
      { label: 'Feb', beforeMinutes: 4.8, afterMinutes: 2.9 },
      { label: 'Mar', beforeMinutes: 4.5, afterMinutes: 2.7 },
      { label: 'Apr', beforeMinutes: 4.3, afterMinutes: 2.5 },
      { label: 'May', beforeMinutes: 4.1, afterMinutes: 2.4 },
      { label: 'Jun', beforeMinutes: 4.0, afterMinutes: 2.3 },
    ],
  };

  // Profit data
  const profitData = {
    monthly: [
      { month: 'Jan', laborCost: 85000, savings: 32000, revenue: 520000 },
      { month: 'Feb', laborCost: 82000, savings: 38000, revenue: 548000 },
      { month: 'Mar', laborCost: 78000, savings: 42000, revenue: 575000 },
      { month: 'Apr', laborCost: 75000, savings: 48000, revenue: 598000 },
      { month: 'May', laborCost: 72000, savings: 52000, revenue: 625000 },
      { month: 'Jun', laborCost: 70000, savings: 58000, revenue: 652000 },
    ],
  };

  // Worker productivity data
  const workerProductivity = [
    { name: 'Worker #142', ordersPerHour: 28, avgPickTime: 2.1, accuracy: 99.5 },
    { name: 'Worker #089', ordersPerHour: 26, avgPickTime: 2.3, accuracy: 99.2 },
    { name: 'Worker #215', ordersPerHour: 25, avgPickTime: 2.4, accuracy: 98.9 },
    { name: 'Worker #067', ordersPerHour: 24, avgPickTime: 2.5, accuracy: 99.1 },
    { name: 'Worker #193', ordersPerHour: 23, avgPickTime: 2.6, accuracy: 98.7 },
  ];

  // Category performance
  const categoryPerformance = [
    { category: 'Electronics', picks: 12500, avgTime: 2.1, revenue: 185000 },
    { category: 'Clothing', picks: 18200, avgTime: 1.8, revenue: 142000 },
    { category: 'Home & Garden', picks: 9800, avgTime: 2.4, revenue: 98000 },
    { category: 'Sports', picks: 7500, avgTime: 2.2, revenue: 75000 },
  ];

  // ROI breakdown
  const roiBreakdown = [
    { item: 'Labor Cost Reduction', annual: 320000, percentage: 59 },
    { item: 'Error Rate Reduction', annual: 85000, percentage: 16 },
    { item: 'Increased Throughput', annual: 95000, percentage: 18 },
    { item: 'Training Time Saved', annual: 40000, percentage: 7 },
  ];

  const totalROI = roiBreakdown.reduce((sum, item) => sum + item.annual, 0);

  const currentTimeSavings = timeSavingsData[timeRange] || timeSavingsData.month;
  const maxTime = Math.max(...currentTimeSavings.map(d => Math.max(d.beforeMinutes, d.afterMinutes)));

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="header-content">
          <h1>📊 Real Business Impact</h1>
          <p>Comprehensive analysis of time saved, efficiency gains, and profit impact</p>
        </div>
        <div className="time-range-selector">
          <button 
            className={timeRange === 'daily' ? 'active' : ''} 
            onClick={() => setTimeRange('daily')}
          >
            Daily
          </button>
          <button 
            className={timeRange === 'weekly' ? 'active' : ''} 
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''} 
            onClick={() => setTimeRange('month')}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="key-metrics">
        <div className="metric-card time">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <span className="metric-value">{animatedValues.timeSaved.toLocaleString()}</span>
            <span className="metric-unit">hours</span>
            <span className="metric-label">Annual Time Saved</span>
            <span className="metric-change positive">↑ 42% vs last year</span>
          </div>
        </div>
        <div className="metric-card money">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <span className="metric-value">₹{(animatedValues.costSaved / 1000).toFixed(0)}K</span>
            <span className="metric-label">Annual Cost Savings</span>
            <span className="metric-change positive">↑ ₹125K vs last year</span>
          </div>
        </div>
        <div className="metric-card orders">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <span className="metric-value">{(animatedValues.ordersProcessed / 1000).toFixed(0)}K</span>
            <span className="metric-label">Orders Processed (YTD)</span>
            <span className="metric-change positive">↑ 35% throughput</span>
          </div>
        </div>
        <div className="metric-card efficiency">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <span className="metric-value">{animatedValues.efficiency}%</span>
            <span className="metric-label">Operational Efficiency</span>
            <span className="metric-change positive">↑ 18 points</span>
          </div>
        </div>
      </div>

      {/* Time Savings Analysis */}
      <div className="analytics-section">
        <h2>⏱️ Time Savings Analysis</h2>
        <div className="section-grid">
          <div className="chart-card large">
            <h3>Average Pick Time Comparison</h3>
            <p className="chart-subtitle">Before vs After WareTrack Implementation</p>
            <div className="comparison-chart">
              {currentTimeSavings.map((data, index) => {
                const beforeHeight = (data.beforeMinutes / maxTime) * 100;
                const afterHeight = (data.afterMinutes / maxTime) * 100;
                const savings = ((data.beforeMinutes - data.afterMinutes) / data.beforeMinutes * 100).toFixed(0);
                
                return (
                  <div key={index} className="comparison-bar-group">
                    <div className="bars">
                      <div className="bar-container">
                        <div 
                          className="bar before" 
                          style={{ height: `${beforeHeight}%` }}
                        >
                          <span className="bar-value">{data.beforeMinutes}m</span>
                        </div>
                      </div>
                      <div className="bar-container">
                        <div 
                          className="bar after" 
                          style={{ height: `${afterHeight}%` }}
                        >
                          <span className="bar-value">{data.afterMinutes}m</span>
                        </div>
                      </div>
                    </div>
                    <span className="bar-label">{data.label}</span>
                    <span className="savings-badge">-{savings}%</span>
                  </div>
                );
              })}
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot before"></span> Before WareTrack</span>
              <span className="legend-item"><span className="dot after"></span> After WareTrack</span>
            </div>
          </div>

          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">🚶</span>
                <span className="stat-title">Walking Distance Reduced</span>
              </div>
              <div className="stat-value">62%</div>
              <div className="stat-detail">
                <span>Before: 2.4 km/shift</span>
                <span>After: 0.9 km/shift</span>
              </div>
              <div className="stat-bar">
                <div className="stat-progress" style={{ width: '62%' }}></div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">🔍</span>
                <span className="stat-title">Search Time Eliminated</span>
              </div>
              <div className="stat-value">85%</div>
              <div className="stat-detail">
                <span>Before: 45 sec/item</span>
                <span>After: 7 sec/item</span>
              </div>
              <div className="stat-bar">
                <div className="stat-progress" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">📋</span>
                <span className="stat-title">Training Time Reduced</span>
              </div>
              <div className="stat-value">70%</div>
              <div className="stat-detail">
                <span>Before: 2 weeks</span>
                <span>After: 3 days</span>
              </div>
              <div className="stat-bar">
                <div className="stat-progress" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profit & Cost Analysis */}
      <div className="analytics-section">
        <h2>💰 Profit & Cost Analysis</h2>
        <div className="section-grid">
          <div className="chart-card">
            <h3>Monthly Financial Impact</h3>
            <div className="financial-chart">
              {profitData.monthly.map((data, index) => (
                <div key={index} className="financial-row">
                  <span className="month-label">{data.month}</span>
                  <div className="financial-bars">
                    <div className="fin-bar-group">
                      <div 
                        className="fin-bar savings" 
                        style={{ width: `${(data.savings / 60000) * 100}%` }}
                      >
                        <span>${(data.savings / 1000).toFixed(0)}K</span>
                      </div>
                      <span className="fin-label">Savings</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>ROI Breakdown</h3>
            <div className="roi-chart">
              <div className="roi-total">
                <span className="roi-value">${(totalROI / 1000).toFixed(0)}K</span>
                <span className="roi-label">Total Annual ROI</span>
              </div>
              <div className="roi-items">
                {roiBreakdown.map((item, index) => (
                  <div key={index} className="roi-item">
                    <div className="roi-item-header">
                      <span className="roi-item-name">{item.item}</span>
                      <span className="roi-item-value">${(item.annual / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="roi-bar-container">
                      <div 
                        className="roi-bar" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                      <span className="roi-percentage">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profit Summary Cards */}
        <div className="profit-cards">
          <div className="profit-card">
            <div className="profit-header">
              <span className="profit-icon">📉</span>
              <span className="profit-title">Labor Cost Reduction</span>
            </div>
            <div className="profit-body">
              <div className="profit-comparison">
                <div className="comparison-item">
                  <span className="label">Before</span>
                  <span className="value old">₹85,000/mo</span>
                </div>
                <div className="comparison-arrow">→</div>
                <div className="comparison-item">
                  <span className="label">After</span>
                  <span className="value new">₹70,000/mo</span>
                </div>
              </div>
              <div className="profit-savings">
                <span className="savings-amount">₹180,000</span>
                <span className="savings-period">saved annually</span>
              </div>
            </div>
          </div>

          <div className="profit-card">
            <div className="profit-header">
              <span className="profit-icon">📈</span>
              <span className="profit-title">Revenue Increase</span>
            </div>
            <div className="profit-body">
              <div className="profit-comparison">
                <div className="comparison-item">
                  <span className="label">6 mo ago</span>
                  <span className="value old">₹520K/mo</span>
                </div>
                <div className="comparison-arrow">→</div>
                <div className="comparison-item">
                  <span className="label">Current</span>
                  <span className="value new">₹652K/mo</span>
                </div>
              </div>
              <div className="profit-savings">
                <span className="savings-amount">+25.4%</span>
                <span className="savings-period">revenue growth</span>
              </div>
            </div>
          </div>

          <div className="profit-card">
            <div className="profit-header">
              <span className="profit-icon">🎯</span>
              <span className="profit-title">Error Cost Reduction</span>
            </div>
            <div className="profit-body">
              <div className="profit-comparison">
                <div className="comparison-item">
                  <span className="label">Error Rate</span>
                  <span className="value old">2.3%</span>
                </div>
                <div className="comparison-arrow">→</div>
                <div className="comparison-item">
                  <span className="label">Current</span>
                  <span className="value new">0.8%</span>
                </div>
              </div>
              <div className="profit-savings">
                <span className="savings-amount">₹85,000</span>
                <span className="savings-period">saved in returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Worker Productivity */}
      <div className="analytics-section">
        <h2>👷 Worker Productivity</h2>
        <div className="productivity-table">
          <div className="table-header">
            <span>Worker</span>
            <span>Orders/Hour</span>
            <span>Avg Pick Time</span>
            <span>Accuracy</span>
            <span>Performance</span>
          </div>
          {workerProductivity.map((worker, index) => (
            <div key={index} className="table-row">
              <span className="worker-name">
                <span className="rank">#{index + 1}</span>
                {worker.name}
              </span>
              <span className="orders">{worker.ordersPerHour}</span>
              <span className="pick-time">{worker.avgPickTime} min</span>
              <span className="accuracy">{worker.accuracy}%</span>
              <span className="performance">
                <div className="perf-bar">
                  <div 
                    className="perf-fill" 
                    style={{ width: `${(worker.ordersPerHour / 30) * 100}%` }}
                  ></div>
                </div>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Performance */}
      <div className="analytics-section">
        <h2>📁 Category Performance</h2>
        <div className="category-grid">
          {categoryPerformance.map((cat, index) => (
            <div key={index} className="category-card">
              <div className="category-header">
                <span className="category-name">{cat.category}</span>
                <span className="category-revenue">${(cat.revenue / 1000).toFixed(0)}K</span>
              </div>
              <div className="category-stats">
                <div className="cat-stat">
                  <span className="cat-value">{cat.picks.toLocaleString()}</span>
                  <span className="cat-label">Picks</span>
                </div>
                <div className="cat-stat">
                  <span className="cat-value">{cat.avgTime}m</span>
                  <span className="cat-label">Avg Time</span>
                </div>
              </div>
              <div className="category-bar">
                <div 
                  className="cat-progress" 
                  style={{ width: `${(cat.picks / 20000) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Insights */}
      <div className="insights-section">
        <h2>💡 Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-card success">
            <div className="insight-icon">✅</div>
            <div className="insight-content">
              <h4>ROI Achievement</h4>
              <p>System paid for itself in <strong>4 months</strong>. Current ROI is <strong>180%</strong> with projected annual savings of <strong>₹540K</strong>.</p>
            </div>
          </div>
          <div className="insight-card info">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h4>Productivity Boost</h4>
              <p>Workers now process <strong>35% more orders</strong> per shift with <strong>65% fewer errors</strong>, directly impacting customer satisfaction.</p>
            </div>
          </div>
          <div className="insight-card warning">
            <div className="insight-icon">⚠️</div>
            <div className="insight-content">
              <h4>Optimization Opportunity</h4>
              <p>Home & Garden section has highest avg pick time (2.4m). Consider <strong>rack reorganization</strong> for additional 15% improvement.</p>
            </div>
          </div>
          <div className="insight-card highlight">
            <div className="insight-icon">🏆</div>
            <div className="insight-content">
              <h4>Best Performer</h4>
              <p>Worker #142 leads with <strong>28 orders/hour</strong> and <strong>99.5% accuracy</strong>. Consider using their path patterns as training template.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
