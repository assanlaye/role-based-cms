require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Article = require('../models/Article');
const Role = require('../models/Role');
const cloudinary = require('../config/cloudinary');

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Find SuperAdmin role
    const superAdminRole = await Role.findOne({ name: 'SuperAdmin' });
    if (!superAdminRole) {
      console.log('SuperAdmin role not found. Run seedRoles.js first.');
      process.exit(1);
    }

    // Find SuperAdmin user
    const superAdmin = await User.findOne({ role: superAdminRole._id });
    if (!superAdmin) {
      console.log('SuperAdmin user not found. Run seed-admin first.');
      process.exit(1);
    }

    console.log('SuperAdmin user found:', superAdmin.email);

    // Delete all articles and their images
    console.log('Deleting all articles...');
    const articles = await Article.find({});
    let deletedImages = 0;

    for (const article of articles) {
      if (article.image) {
        try {
          // Extract public_id from Cloudinary URL
          const publicId = article.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`cms-articles/${publicId}`);
          deletedImages++;
        } catch (error) {
          console.log(`Failed to delete image for article: ${article._id}`);
        }
      }
    }

    const articleResult = await Article.deleteMany({});
    console.log(`Deleted ${articleResult.deletedCount} articles and ${deletedImages} images`);

    // Delete user profile photos and users (except SuperAdmin)
    console.log('Deleting all users except SuperAdmin...');
    const users = await User.find({ _id: { $ne: superAdmin._id } });
    let deletedProfilePhotos = 0;

    for (const user of users) {
      if (user.profilePhoto) {
        try {
          const publicId = user.profilePhoto.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`cms-profiles/${publicId}`);
          deletedProfilePhotos++;
        } catch (error) {
          console.log(`Failed to delete profile photo for user: ${user._id}`);
        }
      }
    }

    const userResult = await User.deleteMany({ _id: { $ne: superAdmin._id } });
    console.log(`Deleted ${userResult.deletedCount} users and ${deletedProfilePhotos} profile photos`);

    console.log('\nCleanup completed successfully!');
    console.log(`- Articles deleted: ${articleResult.deletedCount}`);
    console.log(`- Article images deleted: ${deletedImages}`);
    console.log(`- Users deleted: ${userResult.deletedCount}`);
    console.log(`- Profile photos deleted: ${deletedProfilePhotos}`);
    console.log(`- SuperAdmin preserved: ${superAdmin.email}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

cleanup();
