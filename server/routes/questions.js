const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Submit anonymous question
router.post('/submit', async (req, res) => {
  try {
    const { question, category } = req.body;

    const newQuestion = new Question({
      question,
      category,
      status: 'pending'
    });

    const savedQuestion = await newQuestion.save();
    
    res.status(201).json({
      success: true,
      message: 'Question submitted successfully',
      data: savedQuestion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get all questions (for display)
router.get('/all', async (req, res) => {
  try {
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get single question
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;