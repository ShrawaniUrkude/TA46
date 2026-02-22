import { assetTypes } from '../../data/assets';
import './AssetCard.css';

function AssetCard({ asset, isSelected, onClick }) {
  const assetType = assetTypes[asset.type];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', className: 'status-active' },
      idle: { label: 'Idle', className: 'status-idle' },
      maintenance: { label: 'Maintenance', className: 'status-maintenance' },
      offline: { label: 'Offline', className: 'status-offline' },
    };
    return statusConfig[status] || statusConfig.offline;
  };

  const statusBadge = getStatusBadge(asset.status);

  return (
    <div 
      className={`asset-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="asset-card-header">
        <div className="asset-icon" style={{ backgroundColor: assetType.color + '20', color: assetType.color }}>
          <span>{assetType.icon}</span>
        </div>
        <div className="asset-info">
          <h4>{asset.name}</h4>
          <span className="asset-id">{asset.id}</span>
        </div>
        <span className={`status-badge ${statusBadge.className}`}>
          {statusBadge.label}
        </span>
      </div>
      
      <div className="asset-card-body">
        <div className="asset-detail">
          <span className="detail-label">Location</span>
          <span className="detail-value">{asset.zone.replace('zone-', 'Zone ').toUpperCase()}</span>
        </div>
        
        <div className="asset-detail">
          <span className="detail-label">Last Seen</span>
          <span className="detail-value">{asset.lastSeen}</span>
        </div>
        
        {asset.battery !== null && (
          <div className="asset-detail">
            <span className="detail-label">Battery</span>
            <div className="battery-indicator">
              <div 
                className={`battery-fill ${asset.battery < 20 ? 'low' : asset.battery < 50 ? 'medium' : 'high'}`}
                style={{ width: `${asset.battery}%` }}
              ></div>
            </div>
            <span className="battery-text">{asset.battery}%</span>
          </div>
        )}
        
        <div className="asset-detail">
          <span className="detail-label">Assigned To</span>
          <span className="detail-value">{asset.assignedTo || 'Unassigned'}</span>
        </div>
      </div>
      
      <div className="asset-card-actions">
        <button className="btn-locate">
          <span>📍</span> Locate
        </button>
        <button className="btn-details">
          Details
        </button>
      </div>
    </div>
  );
}

export default AssetCard;
