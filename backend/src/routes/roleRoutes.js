const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

// Get all roles (authenticated users)
router.get('/', auth, roleController.getAllRoles);

// Get access matrix (authenticated users)
router.get('/access-matrix', auth, roleController.getAccessMatrix);

// Get role by ID (authenticated users)
router.get('/:id', auth, roleController.getRoleById);

// Create new role (SuperAdmin only - must have 'create' permission)
router.post('/', auth, checkPermission('create'), roleController.createRole);

// Update role (SuperAdmin only - must have 'edit' permission)
router.put('/:id', auth, checkPermission('edit'), roleController.updateRole);

// Delete role (SuperAdmin only - must have 'delete' permission)
router.delete('/:id', auth, checkPermission('delete'), roleController.deleteRole);

module.exports = router;