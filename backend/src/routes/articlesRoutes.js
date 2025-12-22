const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const auth = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');
const upload = require('../middleware/upload');

// Get all articles (all authenticated users, filtered by role)
router.get('/', auth, articleController.getAllArticles);

// Get article by ID
router.get('/:id', auth, articleController.getArticleById);

// Create article (must have 'create' permission)
router.post(
  '/',
  auth,
  checkPermission('create'),
  upload.single('image'),
  articleController.createArticle
);

// Update article (must have 'edit' permission)
router.put(
  '/:id',
  auth,
  checkPermission('edit'),
  upload.single('image'),
  articleController.updateArticle
);

// Delete article (must have 'delete' permission)
router.delete('/:id', auth, checkPermission('delete'), articleController.deleteArticle);

// Publish/Unpublish article (must have 'publish' permission)
router.patch('/:id/publish', auth, checkPermission('publish'), articleController.togglePublish);

module.exports = router;