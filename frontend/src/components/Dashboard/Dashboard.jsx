import { useState, useMemo } from 'react';
import { assets as initialAssets, stats } from '../../data/assets';
import WarehouseMap from './WarehouseMap';
import AssetList from './AssetList';
import SearchBar from './SearchBar';
import StatsPanel from './StatsPanel';
import './Dashboard.css';

function Dashboard() {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAssets = useMemo(() => {
    return initialAssets.filter(asset => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        asset.name.toLowerCase().includes(searchLower) ||
        asset.id.toLowerCase().includes(searchLower) ||
        asset.zone.toLowerCase().includes(searchLower) ||
        (asset.assignedTo && asset.assignedTo.toLowerCase().includes(searchLower));
      
      // Type filter
      const matchesType = typeFilter === 'all' || asset.type === typeFilter;
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, typeFilter, statusFilter]);

  const handleAssetSelect = (asset) => {
    setSelectedAsset(selectedAsset?.id === asset.id ? null : asset);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Indoor Asset Tracking</h1>
          <p>Real-time visibility for warehouse equipment and tools</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <span>📊</span> Reports
          </button>
          <button className="btn-primary">
            <span>➕</span> Add Asset
          </button>
        </div>
      </div>

      <StatsPanel stats={stats} assets={initialAssets} />
      
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="dashboard-content">
        <div className="map-section">
          <WarehouseMap
            assets={filteredAssets}
            selectedAsset={selectedAsset}
            onAssetSelect={handleAssetSelect}
          />
        </div>
        
        <div className="list-section">
          <AssetList
            assets={filteredAssets}
            selectedAsset={selectedAsset}
            onAssetSelect={handleAssetSelect}
            filter="all"
          />
        </div>
      </div>

      {selectedAsset && (
        <div className="asset-detail-panel">
          <div className="detail-panel-header">
            <h3>Asset Details</h3>
            <button className="close-btn" onClick={() => setSelectedAsset(null)}>✕</button>
          </div>
          <div className="detail-panel-content">
            <div className="detail-row">
              <span className="label">Name</span>
              <span className="value">{selectedAsset.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">ID</span>
              <span className="value">{selectedAsset.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Status</span>
              <span className={`value status-${selectedAsset.status}`}>{selectedAsset.status}</span>
            </div>
            <div className="detail-row">
              <span className="label">Zone</span>
              <span className="value">{selectedAsset.zone.replace('zone-', 'Zone ').toUpperCase()}</span>
            </div>
            <div className="detail-row">
              <span className="label">Coordinates</span>
              <span className="value">X: {selectedAsset.x}, Y: {selectedAsset.y}</span>
            </div>
            <div className="detail-row">
              <span className="label">Last Seen</span>
              <span className="value">{selectedAsset.lastSeen}</span>
            </div>
            {selectedAsset.battery !== null && (
              <div className="detail-row">
                <span className="label">Battery</span>
                <span className="value">{selectedAsset.battery}%</span>
              </div>
            )}
            <div className="detail-row">
              <span className="label">Assigned To</span>
              <span className="value">{selectedAsset.assignedTo || 'Unassigned'}</span>
            </div>
          </div>
          <div className="detail-panel-actions">
            <button className="btn-full-primary">Navigate to Asset</button>
            <button className="btn-full-secondary">View History</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
