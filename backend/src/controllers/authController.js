const User = require('../models/User');
const Role = require('../models/Role');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');

// Helper function to serialize role object
const serializeRole = (role) => {
  if (!role) {
    return null;
  }
  // If role is already a plain object (from toObject/toJSON), use it directly
  // Otherwise, convert Mongoose document to plain object
  const roleObj = role.toObject ? role.toObject() : role;
  
  // Handle _id - convert ObjectId to string if needed
  let roleId = roleObj._id || roleObj.id;
  if (roleId && typeof roleId === 'object' && roleId.toString) {
    roleId = roleId.toString();
  }
  
  return {
    _id: roleId,
    name: roleObj.name,
    permissions: roleObj.permissions || {
      create: false,
      edit: false,
      delete: false,
      publish: false,
      view: true
    },
    isCustom: roleObj.isCustom || false,
    createdAt: roleObj.createdAt,
    updatedAt: roleObj.updatedAt
  };
};

// Register new user
const register = async (req, res) => {
  try {
    const { fullName, email, password, profilePhoto } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Always assign Viewer role to new registrations for security
    const userRole = await Role.findOne({ name: 'Viewer' });
    
    if (!userRole) {
      return res.status(500).json({ message: 'Default role not found. Please seed the database.' });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      role: userRole._id,
      profilePhoto: req.file?.path || profilePhoto
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();
    await user.populate('role');

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).populate('role');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user with this refresh token
    const user = await User.findOne({ _id: decoded.id, refreshToken });

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id);

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove refresh token from user
      await User.updateOne({ refreshToken }, { refreshToken: null });
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('role').select('-password -refreshToken');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile
};
