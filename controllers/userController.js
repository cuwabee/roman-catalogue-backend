const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getRecommendations } = require('../services/recommendationService');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.getUserCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.userId }).populate('items.novel', 'title author');
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user cart', error: error.message });
    }
  };

exports.updatePreferences = async (req, res) => {
    try {
      const { favoriteGenres } = req.body;
      const user = await User.findByIdAndUpdate(
        req.userId,
        { $set: { favoriteGenres } },
        { new: true }
      );
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating preferences', error: error.message });
    }
  };
  
  exports.addToReadList = async (req, res) => {
    try {
      const { novelId } = req.body;
      const user = await User.findByIdAndUpdate(
        req.userId,
        { $addToSet: { readNovels: novelId } },
        { new: true }
      );
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating read list', error: error.message });
    }
  };
  
  exports.getRecommendations = async (req, res) => {
    try {
      const recommendations = await getRecommendations(req.userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: 'Error getting recommendations', error: error.message });
    }
  };