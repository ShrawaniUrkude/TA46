const express = require('express');
const router = express.Router();

// Medical inventory data
const medicalInventory = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Medicines', stock: 2500, unit: 'tablets', expiryDate: '2026-08-15', status: 'adequate', reorderLevel: 500, price: 2.5 },
  { id: 2, name: 'Insulin (Humalog)', category: 'Medicines', stock: 150, unit: 'vials', expiryDate: '2026-04-20', status: 'low', reorderLevel: 200, price: 850 },
  { id: 3, name: 'Surgical Gloves (L)', category: 'Supplies', stock: 5000, unit: 'pairs', expiryDate: '2027-12-01', status: 'adequate', reorderLevel: 1000, price: 8 },
  { id: 4, name: 'N95 Masks', category: 'PPE', stock: 800, unit: 'pieces', expiryDate: '2027-06-30', status: 'adequate', reorderLevel: 500, price: 45 },
  { id: 5, name: 'IV Saline 500ml', category: 'Fluids', stock: 320, unit: 'bags', expiryDate: '2026-11-10', status: 'adequate', reorderLevel: 200, price: 55 },
  { id: 6, name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 180, unit: 'strips', expiryDate: '2026-03-25', status: 'expiring', reorderLevel: 300, price: 35 },
  { id: 7, name: 'Blood Collection Tubes', category: 'Lab Supplies', stock: 1200, unit: 'pieces', expiryDate: '2027-09-15', status: 'adequate', reorderLevel: 500, price: 12 },
  { id: 8, name: 'Oxygen Cylinders', category: 'Equipment', stock: 45, unit: 'units', expiryDate: null, status: 'critical', reorderLevel: 50, price: 4500 },
  { id: 9, name: 'Bandage Rolls', category: 'Supplies', stock: 600, unit: 'rolls', expiryDate: '2028-01-20', status: 'adequate', reorderLevel: 200, price: 25 },
  { id: 10, name: 'Cetrizine 10mg', category: 'Medicines', stock: 90, unit: 'strips', expiryDate: '2026-05-10', status: 'low', reorderLevel: 150, price: 18 }
];

// Hospital departments
const departments = [
  { id: 1, name: 'Emergency', beds: 50, occupied: 42, staff: 35, criticality: 'high' },
  { id: 2, name: 'ICU', beds: 30, occupied: 28, staff: 45, criticality: 'critical' },
  { id: 3, name: 'General Ward', beds: 200, occupied: 165, staff: 80, criticality: 'normal' },
  { id: 4, name: 'Pediatrics', beds: 40, occupied: 25, staff: 25, criticality: 'normal' },
  { id: 5, name: 'Maternity', beds: 35, occupied: 30, staff: 30, criticality: 'high' },
  { id: 6, name: 'Surgery', beds: 25, occupied: 20, staff: 40, criticality: 'high' }
];

// Supply requests
let supplyRequests = [
  { id: 1, department: 'ICU', item: 'Oxygen Cylinders', quantity: 10, priority: 'urgent', status: 'pending', requestedAt: '2026-02-22 09:30' },
  { id: 2, department: 'Emergency', item: 'IV Saline 500ml', quantity: 50, priority: 'high', status: 'approved', requestedAt: '2026-02-22 08:15' },
  { id: 3, department: 'General Ward', item: 'Paracetamol 500mg', quantity: 200, priority: 'normal', status: 'delivered', requestedAt: '2026-02-21 14:00' },
  { id: 4, department: 'Surgery', item: 'Surgical Gloves (L)', quantity: 500, priority: 'high', status: 'in-transit', requestedAt: '2026-02-22 07:45' },
  { id: 5, department: 'Pediatrics', item: 'Cetrizine 10mg', quantity: 30, priority: 'normal', status: 'pending', requestedAt: '2026-02-22 10:00' }
];

// Get medical inventory
router.get('/inventory', (req, res) => {
  const { category, status } = req.query;
  let filtered = [...medicalInventory];
  
  if (category) filtered = filtered.filter(i => i.category === category);
  if (status) filtered = filtered.filter(i => i.status === status);
  
  const stats = {
    totalItems: medicalInventory.length,
    lowStock: medicalInventory.filter(i => i.status === 'low' || i.status === 'critical').length,
    expiring: medicalInventory.filter(i => i.status === 'expiring').length,
    totalValue: medicalInventory.reduce((sum, item) => sum + (item.stock * item.price), 0)
  };
  
  res.json({
    success: true,
    data: filtered,
    stats
  });
});

// Get departments
router.get('/departments', (req, res) => {
  const totalBeds = departments.reduce((sum, d) => sum + d.beds, 0);
  const occupiedBeds = departments.reduce((sum, d) => sum + d.occupied, 0);
  
  res.json({
    success: true,
    data: departments,
    stats: {
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      occupancyRate: ((occupiedBeds / totalBeds) * 100).toFixed(1)
    }
  });
});

// Get supply requests
router.get('/requests', (req, res) => {
  const { status, priority } = req.query;
  let filtered = [...supplyRequests];
  
  if (status) filtered = filtered.filter(r => r.status === status);
  if (priority) filtered = filtered.filter(r => r.priority === priority);
  
  res.json({
    success: true,
    data: filtered,
    stats: {
      total: supplyRequests.length,
      pending: supplyRequests.filter(r => r.status === 'pending').length,
      urgent: supplyRequests.filter(r => r.priority === 'urgent').length
    }
  });
});

// Create supply request
router.post('/requests', (req, res) => {
  const newRequest = {
    id: supplyRequests.length + 1,
    ...req.body,
    status: 'pending',
    requestedAt: new Date().toISOString()
  };
  supplyRequests.push(newRequest);
  res.status(201).json({ success: true, message: 'Request created', data: newRequest });
});

// Update request status
router.put('/requests/:id', (req, res) => {
  const index = supplyRequests.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }
  supplyRequests[index] = { ...supplyRequests[index], ...req.body };
  res.json({ success: true, message: 'Request updated', data: supplyRequests[index] });
});

module.exports = router;
