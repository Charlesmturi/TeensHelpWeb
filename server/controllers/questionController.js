const Question = require('../models/Question');

// @desc    Submit anonymous question
// @route   POST /api/questions/submit
// @access  Private
exports.submitQuestion = async (req, res, next) => {
  try {
    const { question, category } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    const newQuestion = new Question({
      question: question.trim(),
      category: category || 'general'
    });

    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: 'Question submitted successfully! It will be reviewed soon.',
      data: newQuestion
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all approved questions
// @route   GET /api/questions/all
// @access  Public
exports.getAllQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({
      status: { $in: ['approved', 'answered'] }
    })
    .select('-__v')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get questions by category
// @route   GET /api/questions/category/:category
// @access  Public
exports.getQuestionsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    
    const questions = await Question.find({
      category,
      status: { $in: ['approved', 'answered'] }
    })
    .select('-__v')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });

  } catch (error) {
    next(error);
  }
};

exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate({
        path: 'answers.answeredBy',
        select: 'username firstName lastName userType role profile'
      })
      .populate({
        path: 'answers.likes.user',
        select: 'username firstName lastName'
      });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    if (question.status === 'pending' || question.status === 'rejected') {
      return res.status(200).json({
        success: true,
        message: 'Question is pending approval',
        data: question
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    next(error);
  }
};
