const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/roleMiddleware');

// Configure multer for image uploads
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
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