import './StatsPanel.css';

function StatsPanel({ stats, assets }) {
  const activeCount = assets.filter(a => a.status === 'active').length;
  const idleCount = assets.filter(a => a.status === 'idle').length;
  const maintenanceCount = assets.filter(a => a.status === 'maintenance').length;
  const offlineCount = assets.filter(a => a.status === 'offline').length;
  const lowBatteryCount = assets.filter(a => a.battery !== null && a.battery < 20).length;

  const statCards = [
    {
      label: 'Total Assets',
      value: assets.length,
      icon: '📦',
      color: '#3B82F6',
      bgColor: '#EFF6FF',
    },
    {
      label: 'Active',
      value: activeCount,
      icon: '✅',
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      label: 'Idle',
      value: idleCount,
      icon: '⏸️',
      color: '#F59E0B',
      bgColor: '#FFFBEB',
    },
    {
      label: 'Maintenance',
      value: maintenanceCount,
      icon: '🔧',
      color: '#EF4444',
      bgColor: '#FEF2F2',
    },
    {
      label: 'Offline',
      value: offlineCount,
      icon: '📴',
      color: '#6B7280',
      bgColor: '#F9FAFB',
    },
    {
      label: 'Low Battery',
      value: lowBatteryCount,
      icon: '🔋',
      color: '#DC2626',
      bgColor: '#FEF2F2',
    },
  ];

  return (
    <div className="stats-panel">
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card"
            style={{ backgroundColor: stat.bgColor }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="performance-stats">
        <div className="perf-stat">
          <span className="perf-icon">⏱️</span>
          <div className="perf-content">
            <span className="perf-value">{stats.avgSearchTime}</span>
            <span className="perf-label">Avg. Locate Time</span>
          </div>
        </div>
        <div className="perf-stat">
          <span className="perf-icon">💰</span>
          <div className="perf-content">
            <span className="perf-value">{stats.timeSaved}</span>
            <span className="perf-label">Time Saved Daily</span>
          </div>
        </div>
        <div className="perf-stat">
          <span className="perf-icon">📐</span>
          <div className="perf-content">
            <span className="perf-value">{stats.coverageArea}</span>
            <span className="perf-label">Coverage Area</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
