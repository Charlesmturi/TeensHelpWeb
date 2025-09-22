const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getPendingQuestions,
  updateQuestionStatus,
  getModerationStats
} = require('../controllers/moderationController');

// All routes protected and require moderator/admin role
router.use(protect);
router.use(authorize('moderator', 'admin'));

router.get('/pending', getPendingQuestions);
router.get('/stats', getModerationStats);
router.put('/questions/:id/status', updateQuestionStatus);

module.exports = router;