const User = require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();

const demoUsers = [
  {
    username: 'admin_demo',
    email: 'admin@demo.com',
    password: 'demo123',
    firstName: 'Admin',
    lastName: 'User',
    userType: 'admin',
    isVerified: true
  },
  {
    username: 'teen_demo',
    email: 'teen@demo.com',
    password: 'demo123',
    firstName: 'Teen',
    lastName: 'User',
    userType: 'teen',
    profile: {
      age: 16,
      location: 'New York',
      bio: 'Looking for help and support'
    }
  },
  {
    username: 'counselor_demo',
    email: 'counselor@demo.com',
    password: 'demo123',
    firstName: 'Professional',
    lastName: 'Counselor',
    userType: 'counselor',
    isVerified: true,
    profile: {
      bio: 'Licensed counselor with 10+ years experience'
    }
  },
  {
    username: 'therapist_demo',
    email: 'therapist@demo.com',
    password: 'demo123',
    firstName: 'Licensed',
    lastName: 'Therapist',
    userType: 'therapist',
    isVerified: true
  },
  {
    username: 'parent_demo',
    email: 'parent@demo.com',
    password: 'demo123',
    firstName: 'Parent',
    lastName: 'User',
    userType: 'parent'
  },
  {
    username: 'school_admin_demo',
    email: 'school@demo.com',
    password: 'demo123',
    firstName: 'School',
    lastName: 'Administrator',
    userType: 'schoolAdmin'
  }
];

const seedDemoData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing demo users
    await User.deleteMany({ email: { $in: demoUsers.map(u => u.email) } });
    console.log('🧹 Cleared existing demo users');

    // Create demo users
    for (const userData of demoUsers) {
      await User.create(userData);
    }

    console.log('✅ Demo data seeded successfully');
    console.log('📧 Demo login emails:');
    demoUsers.forEach(user => {
      console.log(`   ${user.userType}: ${user.email} / demo123`);
    });

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

// Run if called directly
if (require.main === module) {
  seedDemoData();
}

module.exports = seedDemoData;