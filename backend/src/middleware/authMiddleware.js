const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

// Middleware to verify JWT token and authenticate user
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({ message: 'Token is not valid or expired' });
    }

    // Find user and populate role with permissions
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Store the original role ID before populate (in case populate fails)
    const originalRoleId = user.role;

    // Populate role
    await user.populate('role');

    if (!user.isActive) {
      return res.status(401).json({ message: 'User account is inactive' });
    }

    // Check if user has a valid role
    // If role is null/undefined OR if role exists but is an invalid ObjectId reference (populated as null)
    const hasInvalidRole = !user.role || (typeof user.role === 'object' && !user.role._id && !user.role.name);
    
    if (hasInvalidRole) {
      // Check if this might be a SuperAdmin user (common SuperAdmin email)
      const isPotentialSuperAdmin = user.email === 'admin@cms.com' || user.email.toLowerCase().includes('admin');
      
      if (isPotentialSuperAdmin) {
        // Try to find and assign SuperAdmin role
        const superAdminRole = await Role.findOne({ name: 'SuperAdmin' });
        if (superAdminRole) {
          user.role = superAdminRole._id;
          await user.save();
          await user.populate('role');
          console.log(`Restored SuperAdmin role for user ${user._id} (${user.email})`);
        } else {
          console.error(`SuperAdmin role not found in database for user ${user._id} (${user.email})`);
          return res.status(401).json({ 
            message: 'SuperAdmin role not found. Please reseed roles and SuperAdmin user.' 
          });
        }
      } else {
        // For regular users, assign Viewer role
        console.warn(`User ${user._id} (${user.email}) has no valid role assigned. Assigning default Viewer role.`);
        
        // Find and assign default Viewer role
        const defaultRole = await Role.findOne({ name: 'Viewer' });
        if (!defaultRole) {
          console.error('Default Viewer role not found in database. Please seed roles.');
          return res.status(401).json({ message: 'System error: Default role not configured. Please contact administrator.' });
        }
        
        // Assign the default role to the user
        user.role = defaultRole._id;
        await user.save();
        await user.populate('role');
        
        console.log(`Assigned Viewer role to user ${user._id} (${user.email})`);
      }
    }

    // Ensure role has permissions (defensive check)
    if (!user.role.permissions || typeof user.role.permissions !== 'object') {
      console.error(`User ${user._id} (${user.email}) role ${user.role._id || user.role} has no permissions. Permissions value:`, user.role.permissions);
      return res.status(401).json({ message: 'User role permissions not configured properly' });
    }

    // Attach user and permissions to request object
    req.user = user;
    req.permissions = user.role.permissions;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports = auth;