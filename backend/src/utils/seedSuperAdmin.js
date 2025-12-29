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

    // Check if SuperAdmin user already exists by email
    let existingSuperAdmin = await User.findOne({ email: 'admin@cms.com' });
    
    if (existingSuperAdmin) {
      // User exists, check if they have SuperAdmin role
      await existingSuperAdmin.populate('role');
      if (existingSuperAdmin.role && existingSuperAdmin.role.name === 'SuperAdmin') {
        console.log('SuperAdmin user already exists with correct role:', existingSuperAdmin.email);
        mongoose.connection.close();
        process.exit(0);
      } else {
        // User exists but doesn't have SuperAdmin role, update it
        console.log('User exists but doesn\'t have SuperAdmin role. Updating role...');
        existingSuperAdmin.role = superAdminRole._id;
        existingSuperAdmin.isActive = true;
        await existingSuperAdmin.save();
        console.log('SuperAdmin role assigned to existing user:', existingSuperAdmin.email);
        mongoose.connection.close();
        process.exit(0);
      }
    }

    // Check if any user already has SuperAdmin role
    const userWithSuperAdminRole = await User.findOne({ role: superAdminRole._id });
    if (userWithSuperAdminRole) {
      console.log('SuperAdmin user already exists:', userWithSuperAdminRole.email);
      mongoose.connection.close();
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
