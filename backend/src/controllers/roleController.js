const Role = require('../models/Role');

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get role by ID
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new custom role (SuperAdmin only)
const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    // Create new role
    const role = new Role({
      name,
      permissions,
      isCustom: true
    });

    await role.save();

    res.status(201).json({
      message: 'Role created successfully',
      role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update role permissions (SuperAdmin only)
const updateRole = async (req, res) => {
  try {
    const { permissions, name } = req.body;

    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Update role
    if (name) role.name = name;
    if (permissions) role.permissions = { ...role.permissions, ...permissions };

    await role.save();

    res.status(200).json({
      message: 'Role updated successfully',
      role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete custom role (SuperAdmin only)
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Prevent deletion of default roles
    if (!role.isCustom) {
      return res.status(400).json({ message: 'Cannot delete default roles' });
    }

    await Role.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get access matrix (all roles with their permissions)
const getAccessMatrix = async (req, res) => {
  try {
    const roles = await Role.find().select('name permissions');
    
    const matrix = roles.map(role => ({
      role: role.name,
      permissions: role.permissions
    }));

    res.status(200).json(matrix);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getAccessMatrix
};