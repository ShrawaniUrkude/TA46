const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Food & Beverages', 'Chemicals', 'Equipment', 'Raw Materials', 'Other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    default: 'units'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    zone: String,
    shelf: String,
    row: String
  },
  expiryDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['available', 'low-stock', 'expiring', 'expired', 'out-of-stock'],
    default: 'available'
  },
  supplier: {
    name: String,
    contact: String
  },
  batchNumber: String,
  barcode: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
assetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Asset', assetSchema);
