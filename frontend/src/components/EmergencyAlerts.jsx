import { useState, useEffect, useMemo } from 'react';
import { products } from '../data/warehouse';
import './EmergencyAlerts.css';

export function EmergencyAlerts({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('conflicts');
  const [workerData, setWorkerData] = useState([]);

  // Sample worker data with tool requests
  useEffect(() => {
    const mockWorkers = [
      {
        id: 'W001',
        name: 'John Smith',
        requestedProduct: 'SKU-021',
        productName: 'Nike Air Max',
        deliveryTime: 5,
        priority: 'high',
        status: 'waiting',
        orderTime: new Date(Date.now() - 2 * 60000),
      },
      {
        id: 'W002',
        name: 'Sarah Johnson',
        requestedProduct: 'SKU-021',
        productName: 'Nike Air Max',
        deliveryTime: 8,
        priority: 'critical',
        status: 'waiting',
        orderTime: new Date(Date.now() - 1 * 60000),
      },
      {
        id: 'W003',
        name: 'Mike Davis',
        requestedProduct: 'SKU-021',
        productName: 'Nike Air Max',
        deliveryTime: 10,
        priority: 'high',
        status: 'waiting',
        orderTime: new Date(Date.now() - 3 * 60000),
      },
      {
        id: 'W004',
        name: 'Emma Wilson',
        requestedProduct: 'SKU-014',
        productName: 'Dyson V15 Vacuum',
        deliveryTime: 3,
        priority: 'critical',
        status: 'waiting',
        orderTime: new Date(Date.now() - 4 * 60000),
      },
      {
        id: 'W005',
        name: 'James Brown',
        requestedProduct: 'SKU-014',
        productName: 'Dyson V15 Vacuum',
        deliveryTime: 6,
        priority: 'high',
        status: 'waiting',
        orderTime: new Date(Date.now() - 5 * 60000),
      },
    ];
    setWorkerData(mockWorkers);
  }, []);

  // Analyze conflicts (multiple workers need same product)
  const conflictAnalysis = useMemo(() => {
    const conflicts = {};

    workerData.forEach((worker) => {
      if (!conflicts[worker.requestedProduct]) {
        conflicts[worker.requestedProduct] = [];
      }
      conflicts[worker.requestedProduct].push(worker);
    });

    // Get only products with multiple requests
    const activeConflicts = Object.entries(conflicts)
      .filter(([_, workers]) => workers.length > 1)
      .map(([productId, workers]) => {
        // Sort by priority and urgency
        const sorted = workers.sort((a, b) => {
          const priorityScore = { critical: 3, high: 2, medium: 1, low: 0 };
          const aScore = priorityScore[a.priority] * 100 + (1000 / a.deliveryTime);
          const bScore = priorityScore[b.priority] * 100 + (1000 / b.deliveryTime);
          return bScore - aScore;
        });

        return {
          productId,
          productName: sorted[0].productName,
          conflictCount: workers.length,
          workers: sorted,
          recommendedWorker: sorted[0],
        };
      });

    return activeConflicts;
  }, [workerData]);

  // Individual worker alerts
  const workerAlerts = useMemo(() => {
    return workerData
      .sort((a, b) => {
        const priorityScore = { critical: 3, high: 2, medium: 1, low: 0 };
        const aScore = priorityScore[a.priority] * 100 + (1000 / a.deliveryTime);
        const bScore = priorityScore[b.priority] * 100 + (1000 / b.deliveryTime);
        return bScore - aScore;
      })
      .slice(0, 10);
  }, [workerData]);

  const getPriorityColor = (priority) => {
    const colors = {
      critical: { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
      high: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
      medium: { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
      low: { bg: '#ECFDF5', border: '#10B981', text: '#065F46' },
    };
    return colors[priority] || colors.medium;
  };

  const getUrgencyIndicator = (priority, deliveryTime) => {
    if (priority === 'critical' && deliveryTime <= 5) return '🚨';
    if (priority === 'critical') return '🔴';
    if (priority === 'high' && deliveryTime <= 5) return '⚠️';
    if (priority === 'high') return '🟡';
    return '🔵';
  };

  if (!isOpen) return null;

  return (
    <div className="emergency-overlay" onClick={onClose}>
      <div className="emergency-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="emergency-header">
          <div className="emergency-title">
            <span className="emergency-icon">🚨</span>
            <h2>Emergency Alert System</h2>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Stats */}
        <div className="emergency-stats">
          <div className="stat-box critical">
            <span className="stat-icon">🚨</span>
            <div className="stat-content">
              <span className="stat-label">Resource Conflicts</span>
              <span className="stat-value">{conflictAnalysis.length}</span>
            </div>
          </div>
          <div className="stat-box warning">
            <span className="stat-icon">⏱️</span>
            <div className="stat-content">
              <span className="stat-label">Urgent Requests</span>
              <span className="stat-value">
                {workerData.filter((w) => w.priority === 'critical').length}
              </span>
            </div>
          </div>
          <div className="stat-box">
            <span className="stat-icon">👷</span>
            <div className="stat-content">
              <span className="stat-label">Active Workers</span>
              <span className="stat-value">{workerData.length}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="emergency-tabs">
          <button
            className={`tab-btn ${activeTab === 'conflicts' ? 'active' : ''}`}
            onClick={() => setActiveTab('conflicts')}
          >
            ⚔️ Resource Conflicts ({conflictAnalysis.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            🔔 All Alerts
          </button>
          <button
            className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            📊 Analysis
          </button>
        </div>

        {/* Content */}
        <div className="emergency-content">
          {/* Conflicts Tab */}
          {activeTab === 'conflicts' && (
            <div className="conflicts-section">
              {conflictAnalysis.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">✅</span>
                  <p>No resource conflicts detected!</p>
                </div>
              ) : (
                <div className="conflicts-list">
                  {conflictAnalysis.map((conflict) => (
                    <div key={conflict.productId} className="conflict-item">
                      <div className="conflict-header">
                        <div className="conflict-product">
                          <span className="conflict-badge">⚔️ CONFLICT</span>
                          <span className="product-name">{conflict.productName}</span>
                          <span className="conflict-count">
                            {conflict.conflictCount} workers requesting
                          </span>
                        </div>
                      </div>

                      {/* Recommended Solution */}
                      <div className="recommendation-box">
                        <div className="rec-header">✅ RECOMMENDED SOLUTION</div>
                        <div className="rec-content">
                          <div className="rec-worker">
                            <div className="worker-badge primary">PRIMARY</div>
                            <span className="worker-name">{conflict.recommendedWorker.name}</span>
                            <span className="worker-id">{conflict.recommendedWorker.id}</span>
                          </div>
                          <div className="rec-reason">
                            <div className="reason-item">
                              <span className="reason-label">Priority:</span>
                              <span
                                className="reason-value"
                                style={{
                                  color: getPriorityColor(conflict.recommendedWorker.priority)
                                    .text,
                                }}
                              >
                                {conflict.recommendedWorker.priority.toUpperCase()}
                              </span>
                            </div>
                            <div className="reason-item">
                              <span className="reason-label">Delivery Time:</span>
                              <span className="reason-value">
                                {conflict.recommendedWorker.deliveryTime} min
                              </span>
                            </div>
                            <div className="reason-item">
                              <span className="reason-label">Wait Duration:</span>
                              <span className="reason-value">
                                {Math.round(
                                  (Date.now() - conflict.recommendedWorker.orderTime) / 60000
                                )}{' '}
                                min
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Waiting Workers */}
                      <div className="waiting-workers">
                        <div className="waiting-header">⏳ WAITING WORKERS:</div>
                        {conflict.workers.slice(1).map((worker, idx) => {
                          const priority = getPriorityColor(worker.priority);
                          return (
                            <div
                              key={worker.id}
                              className="waiting-worker-item"
                              style={{
                                borderLeft: `4px solid ${priority.border}`,
                                backgroundColor: priority.bg,
                              }}
                            >
                              <div className="worker-info">
                                <span className="position-badge">#{idx + 2}</span>
                                <span className="worker-name">{worker.name}</span>
                                <span className="worker-id">{worker.id}</span>
                              </div>
                              <div className="worker-stats">
                                <span className="stat">🎯 {worker.deliveryTime} min</span>
                                <span className="stat">⏱️ {worker.priority.toUpperCase()}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="alerts-section">
              <div className="alerts-list">
                {workerAlerts.map((worker) => {
                  const priority = getPriorityColor(worker.priority);
                  const urgency = getUrgencyIndicator(worker.priority, worker.deliveryTime);
                  return (
                    <div
                      key={worker.id}
                      className="alert-item"
                      style={{ borderLeft: `4px solid ${priority.border}` }}
                    >
                      <div className="alert-left">
                        <span className="urgency-indicator">{urgency}</span>
                        <div className="alert-info">
                          <span className="worker-name">{worker.name}</span>
                          <span className="product-info">
                            Requesting: {worker.productName} ({worker.requestedProduct})
                          </span>
                          <span className="time-info">
                            {"⏳ Waiting for "}{Math.round((Date.now() - worker.orderTime) / 60000)}{" min"}
                          </span>
                        </div>
                      </div>
                      <div className="alert-right">
                        <div className="priority-badge" style={priority}>
                          {worker.priority.toUpperCase()}
                        </div>
                        <div className="delivery-time">
                          <span className="time-value">{worker.deliveryTime}</span>
                          <span className="time-label">min</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="analysis-section">
              <div className="analysis-card">
                <h3>📈 Priority Distribution</h3>
                <div className="priority-chart">
                  {['critical', 'high', 'medium', 'low'].map((level) => {
                    const count = workerData.filter((w) => w.priority === level).length;
                    const percent = (count / workerData.length) * 100;
                    const color = getPriorityColor(level);
                    return (
                      <div key={level} className="chart-bar">
                        <div className="bar-label">{level.toUpperCase()}</div>
                        <div className="bar-container">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${percent}%`,
                              background: color.border,
                            }}
                          />
                        </div>
                        <div className="bar-count">{count} workers</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="analysis-card">
                <h3>⚡ Fastest Delivery Required</h3>
                <div className="fast-delivery-list">
                  {workerData
                    .sort((a, b) => a.deliveryTime - b.deliveryTime)
                    .slice(0, 5)
                    .map((worker) => (
                      <div key={worker.id} className="fast-item">
                        <span className="urgency">{getUrgencyIndicator(worker.priority, worker.deliveryTime)}</span>
                        <div className="fast-info">
                          <span className="name">{worker.name}</span>
                          <span className="product">{worker.productName}</span>
                        </div>
                        <span className="time-badge">{worker.deliveryTime} min</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="analysis-card">
                <h3>⏰ Longest Waiting</h3>
                <div className="wait-list">
                  {workerData
                    .sort((a, b) => b.orderTime - a.orderTime)
                    .slice(0, 5)
                    .map((worker) => {
                      const waitTime = Math.round((Date.now() - worker.orderTime) / 60000);
                      return (
                        <div key={worker.id} className="wait-item">
                          <span className="wait-time">{waitTime}m</span>
                          <div className="wait-info">
                            <span className="name">{worker.name}</span>
                            <span className="product">{worker.productName}</span>
                          </div>
                          <span className="priority-dot">{getUrgencyIndicator(worker.priority, worker.deliveryTime)}</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="recommendations">
                <h3>💡 AI Recommendations</h3>
                <ul>
                  <li>
                    ✅ Prioritize workers with delivery time &lt; 5 minutes + critical priority
                  </li>
                  <li>
                    ✅ For conflicts: Assign to worker with highest urgency score
                  </li>
                  <li>
                    ✅ Monitor waiting time - alert if exceeds 10 minutes
                  </li>
                  <li>
                    ✅ Coordinate with management for high-conflict products
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="emergency-footer">
          <div className="footer-info">
            🎯 <strong>System Status:</strong> Monitoring {workerData.length} active workers |
            ⚠️ {conflictAnalysis.length} active conflicts
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyAlerts;
