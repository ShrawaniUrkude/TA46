const express = require('express');
const router = express.Router();

// Analytics data by time range
const analyticsData = {
  daily: {
    revenue: 485000,
    orders: 142,
    avgOrderValue: 3415,
    growth: 12.5
  },
  weekly: {
    revenue: 3250000,
    orders: 985,
    avgOrderValue: 3299,
    growth: 8.2
  },
  monthly: {
    revenue: 14500000,
    orders: 4250,
    avgOrderValue: 3412,
    growth: 15.8
  }
};

const carbonData = {
  daily: { ecoScore: 85, totalEmissions: 145, recyclingRate: 95, energySaved: 42 },
  weekly: { ecoScore: 83, totalEmissions: 1015, recyclingRate: 93, energySaved: 285 },
  monthly: { ecoScore: 81, totalEmissions: 4350, recyclingRate: 91, energySaved: 1180 }
};

const profitData = {
  daily: [
    { category: 'Electronics', revenue: 285000, profit: 42750, margin: 15 },
    { category: 'Food & Beverages', revenue: 125000, profit: 25000, margin: 20 },
    { category: 'Chemicals', revenue: 45000, profit: 9000, margin: 20 },
    { category: 'Equipment', revenue: 30000, profit: 7500, margin: 25 }
  ],
  weekly: [
    { category: 'Electronics', revenue: 1850000, profit: 277500, margin: 15 },
    { category: 'Food & Beverages', revenue: 850000, profit: 170000, margin: 20 },
    { category: 'Chemicals', revenue: 320000, profit: 64000, margin: 20 },
    { category: 'Equipment', revenue: 230000, profit: 57500, margin: 25 }
  ],
  monthly: [
    { category: 'Electronics', revenue: 8200000, profit: 1230000, margin: 15 },
    { category: 'Food & Beverages', revenue: 3800000, profit: 760000, margin: 20 },
    { category: 'Chemicals', revenue: 1400000, profit: 280000, margin: 20 },
    { category: 'Equipment', revenue: 1100000, profit: 275000, margin: 25 }
  ]
};

const productivityData = {
  daily: [
    { worker: 'Team A', ordersProcessed: 48, efficiency: 95, avgTime: '4.2 min' },
    { worker: 'Team B', ordersProcessed: 42, efficiency: 88, avgTime: '4.8 min' },
    { worker: 'Team C', ordersProcessed: 52, efficiency: 92, avgTime: '4.5 min' }
  ],
  weekly: [
    { worker: 'Team A', ordersProcessed: 328, efficiency: 94, avgTime: '4.3 min' },
    { worker: 'Team B', ordersProcessed: 295, efficiency: 87, avgTime: '4.9 min' },
    { worker: 'Team C', ordersProcessed: 362, efficiency: 91, avgTime: '4.6 min' }
  ],
  monthly: [
    { worker: 'Team A', ordersProcessed: 1420, efficiency: 93, avgTime: '4.4 min' },
    { worker: 'Team B', ordersProcessed: 1280, efficiency: 86, avgTime: '5.0 min' },
    { worker: 'Team C', ordersProcessed: 1550, efficiency: 90, avgTime: '4.7 min' }
  ]
};

// Get dashboard analytics
router.get('/dashboard', (req, res) => {
  const { timeRange = 'daily' } = req.query;
  const data = analyticsData[timeRange] || analyticsData.daily;
  
  res.json({
    success: true,
    timeRange,
    data: {
      ...data,
      totalAssets: 1250,
      totalValue: 45000000,
      expiringItems: 45,
      lowStock: 23
    }
  });
});

// Get carbon footprint data
router.get('/carbon', (req, res) => {
  const { timeRange = 'daily' } = req.query;
  const data = carbonData[timeRange] || carbonData.daily;
  
  res.json({
    success: true,
    timeRange,
    data
  });
});

// Get profit analytics
router.get('/profit', (req, res) => {
  const { timeRange = 'daily' } = req.query;
  const data = profitData[timeRange] || profitData.daily;
  
  res.json({
    success: true,
    timeRange,
    data,
    totalProfit: data.reduce((sum, item) => sum + item.profit, 0),
    totalRevenue: data.reduce((sum, item) => sum + item.revenue, 0)
  });
});

// Get worker productivity
router.get('/productivity', (req, res) => {
  const { timeRange = 'daily' } = req.query;
  const data = productivityData[timeRange] || productivityData.daily;
  
  res.json({
    success: true,
    timeRange,
    data,
    avgEfficiency: Math.round(data.reduce((sum, item) => sum + item.efficiency, 0) / data.length)
  });
});

module.exports = router;
