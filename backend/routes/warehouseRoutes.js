const express = require('express');
const router = express.Router();

// Warehouse zones data
const warehouseZones = [
  { id: 'zone-a', name: 'Zone A - Receiving', color: '#3B82F6', x: 0, y: 0, width: 300, height: 200, temperature: '18-22°C', humidity: '45%' },
  { id: 'zone-b', name: 'Zone B - Storage', color: '#10B981', x: 300, y: 0, width: 400, height: 200, temperature: '16-20°C', humidity: '40%' },
  { id: 'zone-c', name: 'Zone C - Picking', color: '#F59E0B', x: 0, y: 200, width: 350, height: 250, temperature: '20-24°C', humidity: '50%' },
  { id: 'zone-d', name: 'Zone D - Shipping', color: '#EF4444', x: 350, y: 200, width: 350, height: 250, temperature: '18-22°C', humidity: '45%' }
];

// Inventory data
const inventory = [
  { id: 1, name: 'Samsung Galaxy S24', category: 'Electronics', quantity: 450, location: 'zone-b', shelf: 'B-12', status: 'in-stock', price: 79999 },
  { id: 2, name: 'Apple MacBook Pro 14"', category: 'Electronics', quantity: 120, location: 'zone-b', shelf: 'B-05', status: 'in-stock', price: 199999 },
  { id: 3, name: 'Sony WH-1000XM5', category: 'Electronics', quantity: 280, location: 'zone-b', shelf: 'B-18', status: 'in-stock', price: 29999 },
  { id: 4, name: 'Dell UltraSharp 27"', category: 'Electronics', quantity: 85, location: 'zone-b', shelf: 'B-22', status: 'low-stock', price: 54999 },
  { id: 5, name: 'Organic Rice 25kg', category: 'Food & Beverages', quantity: 1200, location: 'zone-a', shelf: 'A-01', status: 'in-stock', price: 1899 },
  { id: 6, name: 'Tata Salt 1kg', category: 'Food & Beverages', quantity: 3500, location: 'zone-a', shelf: 'A-03', status: 'in-stock', price: 28 },
  { id: 7, name: 'Amul Butter 500g', category: 'Food & Beverages', quantity: 180, location: 'zone-c', shelf: 'C-Cold-02', status: 'expiring', price: 280, expiryDate: '2026-03-15' },
  { id: 8, name: 'Industrial Lubricant 5L', category: 'Chemicals', quantity: 340, location: 'zone-d', shelf: 'D-Haz-01', status: 'in-stock', price: 1250 },
  { id: 9, name: 'Safety Helmets', category: 'Equipment', quantity: 45, location: 'zone-a', shelf: 'A-15', status: 'low-stock', price: 850 },
  { id: 10, name: 'Packaging Tape Rolls', category: 'Supplies', quantity: 2800, location: 'zone-d', shelf: 'D-08', status: 'in-stock', price: 120 }
];

// Expiry alerts
const expiryAlerts = [
  { id: 1, name: 'Amul Butter 500g', quantity: 180, expiryDate: '2026-03-15', daysLeft: 21, priority: 'high', zone: 'zone-c' },
  { id: 2, name: 'Fresh Milk 1L', quantity: 95, expiryDate: '2026-03-01', daysLeft: 7, priority: 'critical', zone: 'zone-c' },
  { id: 3, name: 'Yogurt Pack 400g', quantity: 220, expiryDate: '2026-03-10', daysLeft: 16, priority: 'medium', zone: 'zone-c' },
  { id: 4, name: 'Bread Loaf 400g', quantity: 150, expiryDate: '2026-02-28', daysLeft: 6, priority: 'critical', zone: 'zone-a' },
  { id: 5, name: 'Orange Juice 1L', quantity: 85, expiryDate: '2026-04-01', daysLeft: 38, priority: 'low', zone: 'zone-c' }
];

// Get warehouse info
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'WareTrack Main Warehouse',
      location: 'Mumbai, India',
      capacity: 10000,
      occupied: 7500,
      utilizationRate: 75,
      totalZones: warehouseZones.length,
      totalProducts: inventory.length,
      totalValue: inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    }
  });
});

// Get warehouse zones
router.get('/zones', (req, res) => {
  res.json({
    success: true,
    data: warehouseZones
  });
});

// Get warehouse inventory
router.get('/inventory', (req, res) => {
  const { category, status, zone } = req.query;
  let filtered = [...inventory];
  
  if (category) filtered = filtered.filter(i => i.category === category);
  if (status) filtered = filtered.filter(i => i.status === status);
  if (zone) filtered = filtered.filter(i => i.location === zone);
  
  res.json({
    success: true,
    data: filtered,
    total: filtered.length,
    totalValue: filtered.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  });
});

// Get expiry alerts
router.get('/expiry-alerts', (req, res) => {
  res.json({
    success: true,
    data: expiryAlerts.sort((a, b) => a.daysLeft - b.daysLeft),
    critical: expiryAlerts.filter(a => a.priority === 'critical').length,
    high: expiryAlerts.filter(a => a.priority === 'high').length,
    medium: expiryAlerts.filter(a => a.priority === 'medium').length
  });
});

module.exports = router;
