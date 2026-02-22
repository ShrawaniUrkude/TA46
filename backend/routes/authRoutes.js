const express = require('express');
const jwt = require('jsonwebtoken');
const Worker = require('../models/Worker');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'waretrack-secret-key-2026';
const JWT_EXPIRES_IN = '7d';

// Generate JWT Token
const generateToken = (worker) => {
  return jwt.sign(
    { id: worker._id, workerId: worker.workerId, role: worker.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// @route   POST /api/auth/signup
// @desc    Register a new worker
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, department, shift } = req.body;

    // Check if worker exists
    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
      return res.status(400).json({
        success: false,
        message: 'Worker with this email already exists'
      });
    }

    // Generate worker ID
    const workerId = await Worker.generateWorkerId();

    // Create new worker
    const worker = new Worker({
      workerId,
      name,
      email,
      password,
      phone,
      department,
      shift
    });

    await worker.save();

    // Generate token
    const token = generateToken(worker);

    res.status(201).json({
      success: true,
      message: 'Worker registered successfully',
      data: {
        token,
        worker: {
          id: worker._id,
          workerId: worker.workerId,
          name: worker.name,
          email: worker.email,
          department: worker.department,
          role: worker.role,
          shift: worker.shift
        }
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering worker',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login worker
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if worker exists
    const worker = await Worker.findOne({ email });
    if (!worker) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if worker is active
    if (!worker.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Contact admin.'
      });
    }

    // Check password
    const isMatch = await worker.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    worker.lastLogin = new Date();
    await worker.save();

    // Generate token
    const token = generateToken(worker);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        worker: {
          id: worker._id,
          workerId: worker.workerId,
          name: worker.name,
          email: worker.email,
          department: worker.department,
          role: worker.role,
          shift: worker.shift,
          avatar: worker.avatar
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current worker profile
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const worker = await Worker.findById(decoded.id).select('-password');

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.json({
      success: true,
      data: worker
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update worker profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, phone, department, shift } = req.body;

    const worker = await Worker.findByIdAndUpdate(
      decoded.id,
      { name, phone, department, shift },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated',
      data: worker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

module.exports = router;
