const User = require('../models/User');
const Role = require('../models/Role');
const tokenService = require('../services/tokenService');

// Register new user
const register = async (req, res) => {
  try {
    const { fullName, email, password, role, profilePhoto } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Find role by name or ID
    let userRole;
    if (role) {
      userRole = await Role.findOne({ $or: [{ name: role }, { _id: role }] });
      if (!userRole) {
        return res.status(400).json({ message: 'Invalid role' });
      }
    } else {
      // Default to Viewer role if not specified
      userRole = await Role.findOne({ name: 'Viewer' });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      role: userRole._id,
      profilePhoto
    });

    await user.save();

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user._id);
    const refreshToken = await tokenService.generateRefreshToken(user._id);

    // Populate role before sending response
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
    const accessToken = tokenService.generateAccessToken(user._id);
    const refreshToken = await tokenService.generateRefreshToken(user._id);

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
    const userId = await tokenService.verifyRefreshToken(refreshToken);

    // Generate new access token
    const accessToken = tokenService.generateAccessToken(userId);

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
      await tokenService.deleteRefreshToken(refreshToken);
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('role').select('-password');
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