// routes/wellnessTips.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  getWellnessTips,
  getRandomTip,
  submitWellnessTip,
  getModerationTips,
  updateTipStatus,
  toggleLike,
  toggleSave,
  markCompleted,
  getComments,
  addComment,
  searchTips,
  getSavedTips,
  getCompletedTips
} = require('../controllers/wellnessTipController');

// Public routes
router.get('/', getWellnessTips);
router.get('/random', getRandomTip);
router.get('/search', searchTips);
router.get('/:id/comments', getComments);

// Private routes (require authentication)
router.post('/submit', auth, submitWellnessTip);
router.patch('/:id/like', auth, toggleLike);
router.patch('/:id/save', auth, toggleSave);
router.patch('/:id/complete', auth, markCompleted);
router.post('/:id/comments', auth, addComment);
router.get('/saved/tips', auth, getSavedTips);
router.get('/completed/tips', auth, getCompletedTips);

// Admin routes (require both authentication AND admin privileges)
router.get('/moderation', auth, admin, getModerationTips);
router.patch('/:id/status', auth, admin, updateTipStatus);

module.exports = router;