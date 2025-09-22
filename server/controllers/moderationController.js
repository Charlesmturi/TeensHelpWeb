const Question = require('../models/Question');

// @desc    Get all pending questions for moderation
// @route   GET /api/moderation/pending
// @access  Private (Moderator/Admin)
exports.getPendingQuestions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const questions = await Question.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-answers'); // Don't need answers for moderation list

    const total = await Question.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: questions
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update question status (Approve/Reject)
// @route   PUT /api/moderation/questions/:id/status
// @access  Private (Moderator/Admin)
exports.updateQuestionStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const questionId = req.params.id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected"'
      });
    }

    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting a question'
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    if (question.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Question has already been moderated'
      });
    }

    const updateData = {
      status,
      moderatedBy: req.user._id,
      moderatedAt: Date.now()
    };

    if (status === 'rejected') {
      updateData.rejectionReason = rejectionReason;
    } else {
      updateData.rejectionReason = undefined;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `Question ${status} successfully`,
      data: updatedQuestion
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get moderation statistics
// @route   GET /api/moderation/stats
// @access  Private (Moderator/Admin)
exports.getModerationStats = async (req, res, next) => {
  try {
    const stats = await Question.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalPending = stats.find(stat => stat._id === 'pending')?.count || 0;
    const totalApproved = stats.find(stat => stat._id === 'approved')?.count || 0;
    const totalRejected = stats.find(stat => stat._id === 'rejected')?.count || 0;
    const totalAnswered = stats.find(stat => stat._id === 'answered')?.count || 0;

    res.status(200).json({
      success: true,
      data: {
        pending: totalPending,
        approved: totalApproved,
        rejected: totalRejected,
        answered: totalAnswered,
        total: totalPending + totalApproved + totalRejected + totalAnswered
      }
    });

  } catch (error) {
    next(error);
  }
};