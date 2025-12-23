const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/roleMiddleware');

// Get all users
router.get('/', authMiddleware, checkPermission('view'), userController.getAllUsers);

// Get user by ID
router.get('/:id', authMiddleware, userController.getUserById);

// Update user role
router.put('/:id/role', authMiddleware, checkPermission('edit'), userController.updateUserRole);

// Delete user
router.delete('/:id', authMiddleware, checkPermission('delete'), userController.deleteUser);

module.exports = router;