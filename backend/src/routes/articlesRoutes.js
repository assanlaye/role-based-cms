const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/roleMiddleware');

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cms-articles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Get all articles
router.get('/', authMiddleware, articleController.getAllArticles);

// Get article by ID
router.get('/:id', authMiddleware, articleController.getArticleById);

// Create article
router.post(
  '/',
  authMiddleware,
  checkPermission('create'),
  upload.single('image'),
  articleController.createArticle
);

// Update article
router.put(
  '/:id',
  authMiddleware,
  checkPermission('edit'),
  upload.single('image'),
  articleController.updateArticle
);

// Delete article
router.delete('/:id', authMiddleware, checkPermission('delete'), articleController.deleteArticle);

// Publish/Unpublish article
router.patch('/:id/publish', authMiddleware, checkPermission('publish'), articleController.togglePublish);

module.exports = router;