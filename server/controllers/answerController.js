const Question = require('../models/Question');
const User = require('../models/User'); // Import User model

// @desc    Add answer to question
// @route   POST /api/questions/:id/answers
// @access  Private
exports.addAnswer = async (req, res, next) => {
  try {
    const { content } = req.body;
    const questionId = req.params.id;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Answer content is required'
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    if (question.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot answer pending or rejected questions'
      });
    }

    const newAnswer = {
      content: content.trim(),
      answeredBy: req.user._id,
      isExpertAnswer: req.user.role === 'expert' || req.user.userType === 'counselor'
    };

    question.answers.push(newAnswer);
    
    // Update question status to answered if it's the first answer
    if (question.answers.length === 1) {
      question.status = 'answered';
    }

    await question.save();

    // Update expert stats if this is an expert answer
    if (newAnswer.isExpertAnswer) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 'stats.answersCount': 1 }
      });
    }

    // Populate the answer with user details
    await question.populate('answers.answeredBy', 'username firstName lastName userType role profile');

    const addedAnswer = question.answers[question.answers.length - 1];

    res.status(201).json({
      success: true,
      message: 'Answer added successfully',
      data: addedAnswer
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get answers for a question
// @route   GET /api/questions/:id/answers
// @access  Public
exports.getAnswers = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('answers.answeredBy', 'username firstName lastName userType role profile')
      .select('answers question status');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    if (question.status !== 'approved' && question.status !== 'answered') {
      return res.status(404).json({
        success: false,
        message: 'Question not found or not yet approved'
      });
    }

    // Sort answers: best answer first, then by likes, then by date
    const sortedAnswers = question.answers.sort((a, b) => {
      if (a.isBestAnswer && !b.isBestAnswer) return -1;
      if (!a.isBestAnswer && b.isBestAnswer) return 1;
      if (a.likes.length !== b.likes.length) return b.likes.length - a.likes.length;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({
      success: true,
      count: sortedAnswers.length,
      question: question.question,
      data: sortedAnswers
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Like an answer
// @route   POST /api/answers/:answerId/like
// @access  Private
exports.likeAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.params;
    
    const question = await Question.findOne({ 'answers._id': answerId });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    const answer = question.answers.id(answerId);
    
    // Check if user already liked this answer
    const alreadyLiked = answer.likes.some(like => 
      like.user.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      // Unlike if already liked
      answer.likes = answer.likes.filter(like => 
        like.user.toString() !== req.user._id.toString()
      );
    } else {
      // Add like
      answer.likes.push({ user: req.user._id });
    }

    await question.save();

    // Update helpful votes count for the answer author if they're an expert
    const answerAuthor = await User.findById(answer.answeredBy);
    if (answerAuthor && (answerAuthor.role === 'expert' || answerAuthor.userType === 'counselor')) {
      await User.findByIdAndUpdate(answer.answeredBy, {
        $inc: { 'stats.helpfulVotes': alreadyLiked ? -1 : 1 }
      });
    }

    res.status(200).json({
      success: true,
      message: alreadyLiked ? 'Answer unliked' : 'Answer liked',
      likes: answer.likes.length
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Mark answer as best answer
// @route   PUT /api/questions/:questionId/best-answer/:answerId
// @access  Private (Question owner or moderator)
exports.markBestAnswer = async (req, res, next) => {
  try {
    const { questionId, answerId } = req.params;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is question owner or moderator/admin
    // Note: Since questions are anonymous, we'll need to track ownership differently
    // For now, only allow moderators/admins
    if (!['moderator', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only moderators can mark best answers'
      });
    }

    // Reset all best answers
    question.answers.forEach(answer => {
      answer.isBestAnswer = false;
    });

    // Set the selected answer as best
    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    answer.isBestAnswer = true;
    await question.save();

    res.status(200).json({
      success: true,
      message: 'Best answer marked successfully',
      data: answer
    });

  } catch (error) {
    next(error);
  }
};