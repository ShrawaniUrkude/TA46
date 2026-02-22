const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  capacity: {
    total: Number,
    used: Number,
    available: Number
  },
  zones: [{
    name: String,
    type: String,
    temperature: String,
    shelves: Number,
    items: Number
  }],
  carbonData: {
    ecoScore: Number,
    totalEmissions: Number,
    recyclingRate: Number
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
