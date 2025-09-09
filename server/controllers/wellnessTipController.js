// controllers/wellnessTipController.js
const WellnessTip = require('../models/WellnessTip');
const Comment = require('../models/Comment');
const User = require('../models/User');

// @desc    Get all wellness tips (with optional filtering)
// @route   GET /api/wellness-tips
// @access  Public
const getWellnessTips = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status } = req.query;
    
    const filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (status) {
      filter.status = status;
    } else {
      filter.status = 'approved'; // Default to approved tips for public access
    }

    const tips = await WellnessTip.find(filter)
      .populate('submittedBy', 'username profile role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await WellnessTip.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: tips,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching wellness tips:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get random wellness tip
// @route   GET /api/wellness-tips/random
// @access  Public
const getRandomTip = async (req, res) => {
  try {
    const { category } = req.query;
    
    const filter = { status: 'approved' };
    
    if (category && category !== 'all') {
      filter.category = category;
    }

    const count = await WellnessTip.countDocuments(filter);
    
    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: 'No tips found'
      });
    }

    const random = Math.floor(Math.random() * count);
    const randomTip = await WellnessTip.findOne(filter)
      .populate('submittedBy', 'username profile role')
      .skip(random);

    res.status(200).json({
      success: true,
      data: randomTip
    });
  } catch (error) {
    console.error('Error fetching random tip:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Submit a new wellness tip
// @route   POST /api/wellness-tips
// @access  Private
const submitWellnessTip = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and category are required'
      });
    }

    const newTip = new WellnessTip({
      title,
      content,
      category,
      tags: tags || [],
      submittedBy: req.user.id,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    const savedTip = await newTip.save();
    await savedTip.populate('submittedBy', 'username profile role');

    res.status(201).json({
      success: true,
      message: req.user.role === 'admin' ? 'Tip created successfully' : 'Tip submitted for review',
      data: savedTip
    });
  } catch (error) {
    console.error('Error submitting tip:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get tips for moderation (admin only)
// @route   GET /api/wellness-tips/moderation
// @access  Private/Admin
const getModerationTips = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const tips = await WellnessTip.find({ status: 'pending' })
      .populate('submittedBy', 'username profile role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await WellnessTip.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      data: tips,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching moderation tips:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update tip status (approve/reject)
// @route   PATCH /api/wellness-tips/:id/status
// @access  Private/Admin
const updateTipStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected"'
      });
    }

    const tip = await WellnessTip.findById(req.params.id);
    
    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    tip.status = status;
    
    if (status === 'rejected' && rejectionReason) {
      tip.rejectionReason = rejectionReason;
    } else if (status === 'approved') {
      tip.rejectionReason = undefined;
    }

    await tip.save();
    await tip.populate('submittedBy', 'username profile role');

    res.status(200).json({
      success: true,
      message: `Tip ${status}`,
      data: tip
    });
  } catch (error) {
    console.error('Error updating tip status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Like/unlike a tip
// @route   PATCH /api/wellness-tips/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const tip = await WellnessTip.findById(req.params.id);
    
    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    const userId = req.user.id;
    const likeIndex = tip.likes.indexOf(userId);

    if (likeIndex === -1) {
      // Like the tip
      tip.likes.push(userId);
    } else {
      // Unlike the tip
      tip.likes.splice(likeIndex, 1);
    }

    await tip.save();

    res.status(200).json({
      success: true,
      message: likeIndex === -1 ? 'Tip liked' : 'Tip unliked',
      data: { likes: tip.likes.length, isLiked: likeIndex === -1 }
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Save/unsave a tip
// @route   PATCH /api/wellness-tips/:id/save
// @access  Private
const toggleSave = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const tipId = req.params.id;

    const saveIndex = user.savedTips.indexOf(tipId);

    if (saveIndex === -1) {
      // Save the tip
      user.savedTips.push(tipId);
    } else {
      // Unsave the tip
      user.savedTips.splice(saveIndex, 1);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: saveIndex === -1 ? 'Tip saved' : 'Tip unsaved',
      data: { isSaved: saveIndex === -1 }
    });
  } catch (error) {
    console.error('Error toggling save:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark tip as completed
// @route   PATCH /api/wellness-tips/:id/complete
// @access  Private
const markCompleted = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const tipId = req.params.id;
    
    // Check if tip exists
    const tip = await WellnessTip.findById(tipId);
    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    // Check if already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const alreadyCompleted = user.completedTips.some(ct => 
      ct.tipId.toString() === tipId && 
      new Date(ct.completedAt).setHours(0, 0, 0, 0) === today.getTime()
    );

    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Tip already completed today'
      });
    }

    // Add to completed tips
    user.completedTips.push({
      tipId: tipId,
      completedAt: new Date()
    });

    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    if (!user.streak.lastCompleted || 
        new Date(user.streak.lastCompleted).setHours(0, 0, 0, 0) < yesterday.getTime()) {
      // Reset streak if not completed yesterday
      user.streak.current = 1;
    } else {
      // Increment streak
      user.streak.current += 1;
    }
    
    user.streak.lastCompleted = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Tip marked as completed',
      data: { streak: user.streak.current }
    });
  } catch (error) {
    console.error('Error marking tip as completed:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get comments for a tip
// @route   GET /api/wellness-tips/:id/comments
// @access  Public
const getComments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const comments = await Comment.find({ tipId: req.params.id, isDeleted: false, parentCommentId: null })
      .populate('userId', 'username profile role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Comment.countDocuments({ 
      tipId: req.params.id, 
      isDeleted: false,
      parentCommentId: null 
    });

    res.status(200).json({
      success: true,
      data: comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add comment to a tip
// @route   POST /api/wellness-tips/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content, parentCommentId } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const tip = await WellnessTip.findById(req.params.id);
    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    const newComment = new Comment({
      content,
      tipId: req.params.id,
      userId: req.user.id,
      parentCommentId: parentCommentId || null
    });

    const savedComment = await newComment.save();
    await savedComment.populate('userId', 'username profile role');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: savedComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search wellness tips
// @route   GET /api/wellness-tips/search
// @access  Public
const searchTips = async (req, res) => {
  try {
    const { q, tags, category, page = 1, limit = 10 } = req.query;
    
    const filter = { status: 'approved' };
    
    // Text search
    if (q) {
      filter.$text = { $search: q };
    }
    
    // Tag filter
    if (tags) {
      const tagArray = tags.split(',');
      filter.tags = { $in: tagArray };
    }
    
    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    const tips = await WellnessTip.find(filter)
      .populate('submittedBy', 'username profile role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await WellnessTip.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: tips,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error searching tips:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's saved tips
// @route   GET /api/wellness-tips/saved
// @access  Private
const getSavedTips = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedTips',
      match: { status: 'approved' },
      populate: { path: 'submittedBy', select: 'username profile role' }
    });
    
    res.status(200).json({
      success: true,
      data: user.savedTips || []
    });
  } catch (error) {
    console.error('Error fetching saved tips:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's completed tips and streak
// @route   GET /api/wellness-tips/completed
// @access  Private
const getCompletedTips = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('completedTips.tipId')
      .select('completedTips streak');
    
    res.status(200).json({
      success: true,
      data: {
        completedTips: user.completedTips,
        streak: user.streak
      }
    });
  } catch (error) {
    console.error('Error fetching completed tips:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
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
};