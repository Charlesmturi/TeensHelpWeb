const User = require('../models/User');

// @desc    Apply to become an expert
// @route   POST /api/experts/apply
// @access  Private
exports.applyForExpert = async (req, res, next) => {
  try {
    const {
      qualifications,
      specialization,
      yearsOfExperience,
      licenseNumber,
      organization,
      bio
    } = req.body;

    // Check if user already applied
    if (req.user.expertApplication.status !== 'not-applied') {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an expert application'
      });
    }

    // Validation
    if (!qualifications || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'Qualifications and specialization are required'
      });
    }

    const updateData = {
      expertApplication: {
        status: 'pending',
        appliedAt: Date.now()
      },
      expertProfile: {
        qualifications: Array.isArray(qualifications) ? qualifications : [qualifications],
        specialization: specialization.trim(),
        yearsOfExperience: yearsOfExperience || 0,
        licenseNumber: licenseNumber ? licenseNumber.trim() : undefined,
        organization: organization ? organization.trim() : undefined,
        bio: bio ? bio.trim() : undefined
      }
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Expert application submitted successfully! It will be reviewed within 48 hours.',
      data: user
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get expert applications (Admin only)
// @route   GET /api/experts/applications
// @access  Private (Admin)
exports.getExpertApplications = async (req, res, next) => {
  try {
    const { status = 'pending' } = req.query;
    
    const applications = await User.find({
      'expertApplication.status': status
    })
    .select('username email firstName lastName expertProfile expertApplication createdAt')
    .sort({ 'expertApplication.appliedAt': -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Review expert application (Admin only)
// @route   PUT /api/experts/applications/:userId/review
// @access  Private (Admin)
exports.reviewExpertApplication = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const { userId } = req.params;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected"'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.expertApplication.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Application has already been reviewed'
      });
    }

    const updateData = {
      'expertApplication.status': status,
      'expertApplication.reviewedAt': Date.now(),
      'expertApplication.reviewedBy': req.user._id
    };

    if (status === 'approved') {
      updateData.role = 'expert';
      updateData.isVerified = true;
      updateData['expertApplication.rejectionReason'] = undefined;
    } else {
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required when rejecting an application'
        });
      }
      updateData['expertApplication.rejectionReason'] = rejectionReason;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: `Expert application ${status} successfully`,
      data: updatedUser
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all verified experts
// @route   GET /api/experts
// @access  Public
exports.getExperts = async (req, res, next) => {
  try {
    const { specialization } = req.query;
    
    let query = { role: 'expert', isVerified: true };
    
    if (specialization) {
      query['expertProfile.specialization'] = new RegExp(specialization, 'i');
    }

    const experts = await User.find(query)
      .select('username firstName lastName expertProfile stats profile')
      .sort({ 'stats.helpfulVotes': -1 });

    res.status(200).json({
      success: true,
      count: experts.length,
      data: experts
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get expert profile
// @route   GET /api/experts/:id
// @access  Public
exports.getExpertProfile = async (req, res, next) => {
  try {
    const expert = await User.findOne({
      _id: req.params.id,
      role: 'expert',
      isVerified: true
    })
    .select('-password -email')
    .populate('stats.answersCount stats.helpfulVotes stats.bestAnswers');

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    res.status(200).json({
      success: true,
      data: expert
    });

  } catch (error) {
    next(error);
  }
};