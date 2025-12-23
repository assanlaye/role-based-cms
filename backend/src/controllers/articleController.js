const Article = require('../models/Article');

// Create new article
const createArticle = async (req, res) => {
  try {
    const { title, body } = req.body;

    const article = new Article({
      title,
      body,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      author: req.user._id
    });

    await article.save();
    await article.populate('author', 'fullName email');

    res.status(201).json({
      message: 'Article created successfully',
      article
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all articles
const getAllArticles = async (req, res) => {
  try {
    let filter = {};

    // If user is Viewer, only show published articles
    if (req.user.role.name === 'Viewer') {
      filter.isPublished = true;
    }

    const articles = await Article.find(filter)
      .populate('author', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get article by ID
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'fullName email');

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // If user is Viewer and article is not published, deny access
    if (req.user.role.name === 'Viewer' && !article.isPublished) {
      return res.status(403).json({ message: 'Access denied to unpublished article' });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update article
const updateArticle = async (req, res) => {
  try {
    const { title, body } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Update fields
    if (title) article.title = title;
    if (body) article.body = body;
    if (req.file) article.image = `/uploads/${req.file.filename}`;

    await article.save();
    await article.populate('author', 'fullName email');

    res.status(200).json({
      message: 'Article updated successfully',
      article
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete article
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Publish/Unpublish article
const togglePublish = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Toggle publish status
    article.isPublished = !article.isPublished;
    article.publishedAt = article.isPublished ? new Date() : null;

    await article.save();
    await article.populate('author', 'fullName email');

    res.status(200).json({
      message: `Article ${article.isPublished ? 'published' : 'unpublished'} successfully`,
      article
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  togglePublish
};