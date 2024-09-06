const Cart = require('../models/cart.model');
const Novel = require('../models/novel.model');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [], total: 0 });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { novelId, chapterId } = req.body;
    const novel = await Novel.findById(novelId);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    const chapter = novel.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [], total: 0 });
    }

    const existingItem = cart.items.find(item => 
      item.novel.toString() === novelId && item.chapter.toString() === chapterId
    );

    if (existingItem) {
      return res.status(400).json({ message: 'Item already in cart' });
    }

    cart.items.push({
      novel: novelId,
      chapter: chapterId,
      title: chapter.title,
      price: chapter.price
    });

    cart.total = cart.items.reduce((total, item) => total + item.price, 0);
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    cart.total = cart.items.reduce((total, item) => total + item.price, 0);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};