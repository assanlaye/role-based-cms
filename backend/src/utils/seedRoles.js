require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../models/Role');

const roles = [
  {
    name: 'SuperAdmin',
    permissions: {
      create: true,
      edit: true,
      delete: true,
      publish: true,
      view: true
    },
    isCustom: false
  },
  {
    name: 'Manager',
    permissions: {
      create: true,
      edit: true,
      delete: false,
      publish: true,
      view: true
    },
    isCustom: false
  },
  {
    name: 'Contributor',
    permissions: {
      create: true,
      edit: true,
      delete: false,
      publish: false,
      view: true
    },
    isCustom: false
  },
  {
    name: 'Viewer',
    permissions: {
      create: false,
      edit: false,
      delete: false,
      publish: false,
      view: true
    },
    isCustom: false
  }
];

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing roles
    await Role.deleteMany({ isCustom: false });
    console.log('Cleared existing default roles');

    // Insert new roles
    await Role.insertMany(roles);
    console.log('Roles seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
};

seedRoles();