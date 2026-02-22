const express = require('express');
const router = express.Router();

// Mock asset data
const assets = [
  { id: 'FL-001', name: 'Forklift #1', type: 'forklift', status: 'active', battery: 87, zone: 'zone-a', x: 120, y: 80, lastSeen: '2 min ago', assignedTo: 'John Smith' },
  { id: 'FL-002', name: 'Forklift #2', type: 'forklift', status: 'active', battery: 45, zone: 'zone-b', x: 450, y: 100, lastSeen: '1 min ago', assignedTo: 'Sarah Johnson' },
  { id: 'FL-003', name: 'Forklift #3', type: 'forklift', status: 'idle', battery: 92, zone: 'zone-c', x: 150, y: 320, lastSeen: '15 min ago', assignedTo: null },
  { id: 'PJ-001', name: 'Pallet Jack #1', type: 'palletJack', status: 'active', battery: 78, zone: 'zone-d', x: 520, y: 350, lastSeen: '30 sec ago', assignedTo: 'Mike Davis' },
  { id: 'PJ-002', name: 'Pallet Jack #2', type: 'palletJack', status: 'maintenance', battery: 12, zone: 'zone-a', x: 80, y: 150, lastSeen: '2 hours ago', assignedTo: null },
  { id: 'PJ-003', name: 'Pallet Jack #3', type: 'palletJack', status: 'active', battery: 65, zone: 'zone-b', x: 580, y: 80, lastSeen: '5 min ago', assignedTo: 'Lisa Wong' },
  { id: 'DT-001', name: 'Diagnostic Tool #1', type: 'diagnosticTool', status: 'active', battery: 95, zone: 'zone-c', x: 250, y: 380, lastSeen: '1 min ago', assignedTo: 'Tom Brown' },
  { id: 'DT-002', name: 'Diagnostic Tool #2', type: 'diagnosticTool', status: 'offline', battery: 0, zone: 'zone-d', x: 620, y: 280, lastSeen: '3 days ago', assignedTo: null },
  { id: 'SC-001', name: 'Handheld Scanner #1', type: 'scanner', status: 'active', battery: 55, zone: 'zone-b', x: 380, y: 150, lastSeen: '10 sec ago', assignedTo: 'Amy Chen' },
  { id: 'SC-002', name: 'Handheld Scanner #2', type: 'scanner', status: 'active', battery: 88, zone: 'zone-c', x: 100, y: 420, lastSeen: '2 min ago', assignedTo: 'David Lee' },
  { id: 'CT-001', name: 'Utility Cart #1', type: 'cart', status: 'idle', battery: null, zone: 'zone-a', x: 200, y: 50, lastSeen: '45 min ago', assignedTo: null },
  { id: 'CT-002', name: 'Utility Cart #2', type: 'cart', status: 'active', battery: null, zone: 'zone-d', x: 450, y: 400, lastSeen: '3 min ago', assignedTo: 'Chris Martin' }
];

const assetTypes = {
  forklift: { icon: '🚜', label: 'Forklift', color: '#3B82F6' },
  palletJack: { icon: '🔧', label: 'Pallet Jack', color: '#10B981' },
  diagnosticTool: { icon: '📟', label: 'Diagnostic Tool', color: '#8B5CF6' },
  scanner: { icon: '📱', label: 'Scanner', color: '#F59E0B' },
  cart: { icon: '🛒', label: 'Utility Cart', color: '#EC4899' }
};

// Get all assets
router.get('/', (req, res) => {
  const stats = {
    totalAssets: assets.length,
    activeAssets: assets.filter(a => a.status === 'active').length,
    idleAssets: assets.filter(a => a.status === 'idle').length,
    maintenanceAssets: assets.filter(a => a.status === 'maintenance').length,
    offlineAssets: assets.filter(a => a.status === 'offline').length
  };
  
  res.json({
    success: true,
    data: assets,
    assetTypes,
    stats
  });
});

// Get single asset
router.get('/:id', (req, res) => {
  const asset = assets.find(a => a.id === req.params.id);
  if (!asset) {
    return res.status(404).json({ success: false, message: 'Asset not found' });
  }
  res.json({ success: true, data: asset });
});

// Create asset
router.post('/', (req, res) => {
  const newAsset = { id: `NEW-${Date.now()}`, ...req.body };
  assets.push(newAsset);
  res.status(201).json({ success: true, message: 'Asset created', data: newAsset });
});

// Update asset
router.put('/:id', (req, res) => {
  const index = assets.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Asset not found' });
  }
  assets[index] = { ...assets[index], ...req.body };
  res.json({ success: true, message: 'Asset updated', data: assets[index] });
});

// Delete asset
router.delete('/:id', (req, res) => {
  const index = assets.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Asset not found' });
  }
  assets.splice(index, 1);
  res.json({ success: true, message: 'Asset deleted' });
});

module.exports = router;
