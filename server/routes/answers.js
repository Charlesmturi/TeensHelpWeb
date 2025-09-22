const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addAnswer,
  getAnswers,
  likeAnswer,
  markBestAnswer
} = require('../controllers/answerController');

// Public routes
router.get('/questions/:id/answers', getAnswers);

// Protected routes
router.post('/questions/:id/answers', protect, addAnswer);
router.post('/answers/:answerId/like', protect, likeAnswer);
router.put('/questions/:questionId/best-answer/:answerId', protect, markBestAnswer);

module.exports = router;