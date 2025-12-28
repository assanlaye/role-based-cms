require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if SuperAdmin role exists
    const superAdminRole = await Role.findOne({ name: 'SuperAdmin' });
    if (!superAdminRole) {
      console.log('SuperAdmin role not found. Run seedRoles.js first.');
      process.exit(1);
    }

    // Check if SuperAdmin user already exists
    const existingSuperAdmin = await User.findOne({ role: superAdminRole._id });
    if (existingSuperAdmin) {
      console.log('SuperAdmin user already exists:', existingSuperAdmin.email);
      process.exit(0);
    }

    // Create SuperAdmin user
    const superAdmin = new User({
      fullName: 'Super Admin',
      email: 'admin@cms.com',
      password: 'admin123',
      role: superAdminRole._id,
      isActive: true
    });

    await superAdmin.save();
    console.log('SuperAdmin user created successfully!');
    console.log('Email: admin@cms.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login.');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding SuperAdmin:', error);
    process.exit(1);
  }
};

seedSuperAdmin();
