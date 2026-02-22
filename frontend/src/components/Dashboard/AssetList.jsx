import AssetCard from './AssetCard';
import './AssetList.css';

function AssetList({ assets, selectedAsset, onAssetSelect, filter }) {
  const filteredAssets = filter === 'all' 
    ? assets 
    : assets.filter(asset => asset.status === filter);

  return (
    <div className="asset-list-container">
      <div className="asset-list-header">
        <h2>Assets</h2>
        <span className="asset-count">{filteredAssets.length} items</span>
      </div>
      
      <div className="asset-list">
        {filteredAssets.length === 0 ? (
          <div className="no-assets">
            <span>📦</span>
            <p>No assets found</p>
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              isSelected={selectedAsset?.id === asset.id}
              onClick={() => onAssetSelect(asset)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AssetList;
