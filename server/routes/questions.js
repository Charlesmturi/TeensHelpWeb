const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  submitQuestion,
  getAllQuestions,
  getQuestionsByCategory,
  getQuestion
} = require('../controllers/questionController');

// Public routes
router.get('/all', getAllQuestions);
router.get('/category/:category', getQuestionsByCategory);
router.get('/:id', getQuestion);

// Protected routes
router.post('/submit', protect, submitQuestion);



module.exports = router;