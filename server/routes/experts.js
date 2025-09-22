const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  applyForExpert,
  getExpertApplications,
  reviewExpertApplication,
  getExperts,
  getExpertProfile
} = require('../controllers/expertController');

// Public routes
router.get('/', getExperts);
router.get('/:id', getExpertProfile);

// Protected routes
router.post('/apply', protect, applyForExpert);

// Admin only routes
router.get('/applications', protect, authorize('admin'), getExpertApplications);
router.put('/applications/:userId/review', protect, authorize('admin'), reviewExpertApplication);

module.exports = router;