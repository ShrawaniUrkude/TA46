import { useState, useEffect, useMemo } from 'react';
import './Analytics.css';

function Analytics() {
  const [timeRange, setTimeRange] = useState('month');
  const [animatedValues, setAnimatedValues] = useState({
    timeSaved: 0,
    costSaved: 0,
    ordersProcessed: 0,
    efficiency: 0,
  });

  // Metrics data based on time range
  const metricsData = {
    daily: { timeSaved: 8, costSaved: 2100, ordersProcessed: 720, efficiency: 91 },
    weekly: { timeSaved: 58, costSaved: 14500, ordersProcessed: 4800, efficiency: 92 },
    month: { timeSaved: 2100, costSaved: 540000, ordersProcessed: 180000, efficiency: 92 },
  };

  // Animate values on mount and when timeRange changes
  useEffect(() => {
    const targets = metricsData[timeRange] || metricsData.month;

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
  }, [timeRange]);

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
    daily: [
      { label: 'Mon', laborCost: 2800, savings: 1100, revenue: 17500 },
      { label: 'Tue', laborCost: 2750, savings: 1200, revenue: 18200 },
      { label: 'Wed', laborCost: 2600, savings: 1300, revenue: 19000 },
      { label: 'Thu', laborCost: 2500, savings: 1400, revenue: 19800 },
      { label: 'Fri', laborCost: 2400, savings: 1500, revenue: 20500 },
      { label: 'Sat', laborCost: 2350, savings: 1550, revenue: 21200 },
      { label: 'Sun', laborCost: 2300, savings: 1600, revenue: 21800 },
    ],
    weekly: [
      { label: 'Week 1', laborCost: 19200, savings: 8500, revenue: 135000 },
      { label: 'Week 2', laborCost: 18500, savings: 9200, revenue: 142000 },
      { label: 'Week 3', laborCost: 17800, savings: 10000, revenue: 148000 },
      { label: 'Week 4', laborCost: 17200, savings: 10800, revenue: 155000 },
    ],
    month: [
      { label: 'Jan', laborCost: 85000, savings: 32000, revenue: 520000 },
      { label: 'Feb', laborCost: 82000, savings: 38000, revenue: 548000 },
      { label: 'Mar', laborCost: 78000, savings: 42000, revenue: 575000 },
      { label: 'Apr', laborCost: 75000, savings: 48000, revenue: 598000 },
      { label: 'May', laborCost: 72000, savings: 52000, revenue: 625000 },
      { label: 'Jun', laborCost: 70000, savings: 58000, revenue: 652000 },
    ],
  };

  // Worker productivity data
  const workerProductivityData = {
    daily: [
      { name: 'Worker #142', ordersPerHour: 30, avgPickTime: 2.0, accuracy: 99.8 },
      { name: 'Worker #089', ordersPerHour: 28, avgPickTime: 2.2, accuracy: 99.5 },
      { name: 'Worker #215', ordersPerHour: 27, avgPickTime: 2.3, accuracy: 99.1 },
      { name: 'Worker #067', ordersPerHour: 26, avgPickTime: 2.4, accuracy: 99.3 },
      { name: 'Worker #193', ordersPerHour: 25, avgPickTime: 2.5, accuracy: 98.9 },
    ],
    weekly: [
      { name: 'Worker #142', ordersPerHour: 29, avgPickTime: 2.1, accuracy: 99.6 },
      { name: 'Worker #089', ordersPerHour: 27, avgPickTime: 2.3, accuracy: 99.3 },
      { name: 'Worker #215', ordersPerHour: 26, avgPickTime: 2.4, accuracy: 99.0 },
      { name: 'Worker #067', ordersPerHour: 25, avgPickTime: 2.5, accuracy: 99.2 },
      { name: 'Worker #193', ordersPerHour: 24, avgPickTime: 2.6, accuracy: 98.8 },
    ],
    month: [
      { name: 'Worker #142', ordersPerHour: 28, avgPickTime: 2.1, accuracy: 99.5 },
      { name: 'Worker #089', ordersPerHour: 26, avgPickTime: 2.3, accuracy: 99.2 },
      { name: 'Worker #215', ordersPerHour: 25, avgPickTime: 2.4, accuracy: 98.9 },
      { name: 'Worker #067', ordersPerHour: 24, avgPickTime: 2.5, accuracy: 99.1 },
      { name: 'Worker #193', ordersPerHour: 23, avgPickTime: 2.6, accuracy: 98.7 },
    ],
  };

  // Category performance
  const categoryPerformanceData = {
    daily: [
      { category: 'Electronics', picks: 420, avgTime: 2.0, revenue: 6200 },
      { category: 'Clothing', picks: 610, avgTime: 1.7, revenue: 4800 },
      { category: 'Home & Garden', picks: 330, avgTime: 2.3, revenue: 3300 },
      { category: 'Sports', picks: 250, avgTime: 2.1, revenue: 2500 },
    ],
    weekly: [
      { category: 'Electronics', picks: 3100, avgTime: 2.1, revenue: 46000 },
      { category: 'Clothing', picks: 4500, avgTime: 1.8, revenue: 35500 },
      { category: 'Home & Garden', picks: 2400, avgTime: 2.4, revenue: 24500 },
      { category: 'Sports', picks: 1850, avgTime: 2.2, revenue: 18500 },
    ],
    month: [
      { category: 'Electronics', picks: 12500, avgTime: 2.1, revenue: 185000 },
      { category: 'Clothing', picks: 18200, avgTime: 1.8, revenue: 142000 },
      { category: 'Home & Garden', picks: 9800, avgTime: 2.4, revenue: 98000 },
      { category: 'Sports', picks: 7500, avgTime: 2.2, revenue: 75000 },
    ],
  };

  // ROI breakdown
  const roiBreakdownData = {
    daily: [
      { item: 'Labor Cost Reduction', amount: 880, percentage: 59 },
      { item: 'Error Rate Reduction', amount: 235, percentage: 16 },
      { item: 'Increased Throughput', amount: 260, percentage: 18 },
      { item: 'Training Time Saved', amount: 110, percentage: 7 },
    ],
    weekly: [
      { item: 'Labor Cost Reduction', amount: 6200, percentage: 59 },
      { item: 'Error Rate Reduction', amount: 1650, percentage: 16 },
      { item: 'Increased Throughput', amount: 1850, percentage: 18 },
      { item: 'Training Time Saved', amount: 780, percentage: 7 },
    ],
    month: [
      { item: 'Labor Cost Reduction', amount: 320000, percentage: 59 },
      { item: 'Error Rate Reduction', amount: 85000, percentage: 16 },
      { item: 'Increased Throughput', amount: 95000, percentage: 18 },
      { item: 'Training Time Saved', amount: 40000, percentage: 7 },
    ],
  };

  // Get current data based on time range
  const currentTimeSavings = timeSavingsData[timeRange] || timeSavingsData.month;
  const currentProfitData = profitData[timeRange] || profitData.month;
  const currentWorkerProductivity = workerProductivityData[timeRange] || workerProductivityData.month;
  const currentCategoryPerformance = categoryPerformanceData[timeRange] || categoryPerformanceData.month;
  const currentRoiBreakdown = roiBreakdownData[timeRange] || roiBreakdownData.month;
  
  const totalROI = currentRoiBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const maxSavings = Math.max(...currentProfitData.map(d => d.savings));
  const maxPicks = Math.max(...currentCategoryPerformance.map(c => c.picks));
  const maxTime = Math.max(...currentTimeSavings.map(d => Math.max(d.beforeMinutes, d.afterMinutes)));

  // Get time period label
  const getTimeLabel = () => {
    switch (timeRange) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'month': return 'Annual';
      default: return 'Annual';
    }
  };

  const getComparisonLabel = () => {
    switch (timeRange) {
      case 'daily': return 'vs yesterday';
      case 'weekly': return 'vs last week';
      case 'month': return 'vs last year';
      default: return 'vs last year';
    }
  };

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
            <span className="metric-label">{getTimeLabel()} Time Saved</span>
            <span className="metric-change positive">↑ 42% {getComparisonLabel()}</span>
          </div>
        </div>
        <div className="metric-card money">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <span className="metric-value">₹{animatedValues.costSaved >= 1000 ? `${(animatedValues.costSaved / 1000).toFixed(0)}K` : animatedValues.costSaved}</span>
            <span className="metric-label">{getTimeLabel()} Cost Savings</span>
            <span className="metric-change positive">↑ 28% {getComparisonLabel()}</span>
          </div>
        </div>
        <div className="metric-card orders">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <span className="metric-value">{animatedValues.ordersProcessed >= 1000 ? `${(animatedValues.ordersProcessed / 1000).toFixed(0)}K` : animatedValues.ordersProcessed}</span>
            <span className="metric-label">Orders Processed ({getTimeLabel()})</span>
            <span className="metric-change positive">↑ 35% {getComparisonLabel()}</span>
          </div>
        </div>
        <div className="metric-card efficiency">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <span className="metric-value">{animatedValues.efficiency}%</span>
            <span className="metric-label">Operational Efficiency</span>
            <span className="metric-change positive">↑ 18 points {getComparisonLabel()}</span>
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
            <h3>{timeRange === 'daily' ? 'Daily' : timeRange === 'weekly' ? 'Weekly' : 'Monthly'} Financial Impact</h3>
            <div className="financial-chart">
              {currentProfitData.map((data, index) => (
                <div key={index} className="financial-row">
                  <span className="month-label">{data.label}</span>
                  <div className="financial-bars">
                    <div className="fin-bar-group">
                      <div 
                        className="fin-bar savings" 
                        style={{ width: `${(data.savings / maxSavings) * 100}%` }}
                      >
                        <span>₹{data.savings >= 1000 ? `${(data.savings / 1000).toFixed(0)}K` : data.savings}</span>
                      </div>
                      <span className="fin-label">Savings</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>ROI Breakdown ({getTimeLabel()})</h3>
            <div className="roi-chart">
              <div className="roi-total">
                <span className="roi-value">₹{totalROI >= 1000 ? `${(totalROI / 1000).toFixed(0)}K` : totalROI}</span>
                <span className="roi-label">Total {getTimeLabel()} ROI</span>
              </div>
              <div className="roi-items">
                {currentRoiBreakdown.map((item, index) => (
                  <div key={index} className="roi-item">
                    <div className="roi-item-header">
                      <span className="roi-item-name">{item.item}</span>
                      <span className="roi-item-value">₹{item.amount >= 1000 ? `${(item.amount / 1000).toFixed(0)}K` : item.amount}</span>
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
        <h2>👷 Worker Productivity ({getTimeLabel()})</h2>
        <div className="productivity-table">
          <div className="table-header">
            <span>Worker</span>
            <span>Orders/Hour</span>
            <span>Avg Pick Time</span>
            <span>Accuracy</span>
            <span>Performance</span>
          </div>
          {currentWorkerProductivity.map((worker, index) => (
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
        <h2>📁 Category Performance ({getTimeLabel()})</h2>
        <div className="category-grid">
          {currentCategoryPerformance.map((cat, index) => (
            <div key={index} className="category-card">
              <div className="category-header">
                <span className="category-name">{cat.category}</span>
                <span className="category-revenue">₹{cat.revenue >= 1000 ? `${(cat.revenue / 1000).toFixed(0)}K` : cat.revenue}</span>
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
                  style={{ width: `${(cat.picks / maxPicks) * 100}%` }}
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
