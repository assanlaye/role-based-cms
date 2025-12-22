// Middleware to check if user has specific permission
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      // Check if permissions exist
      if (!req.permissions) {
        return res.status(403).json({ 
          message: 'Access denied. No permissions found.' 
        });
      }

      // Check if user has the required permission
      if (!req.permissions[requiredPermission]) {
        return res.status(403).json({ 
          message: `Access denied. You don't have '${requiredPermission}' permission.` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Error checking permissions' });
    }
  };
};

module.exports = checkPermission;