const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const workerSchema = new mongoose.Schema({
  workerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    enum: ['Receiving', 'Storage', 'Picking', 'Shipping', 'Maintenance', 'Supervisor', 'Admin'],
    default: 'Picking'
  },
  role: {
    type: String,
    enum: ['worker', 'supervisor', 'admin'],
    default: 'worker'
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'night'],
    default: 'morning'
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
workerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
workerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate worker ID
workerSchema.statics.generateWorkerId = async function() {
  const count = await this.countDocuments();
  return `WRK-${String(count + 1).padStart(4, '0')}`;
};

module.exports = mongoose.model('Worker', workerSchema);
