const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  novel: { type: mongoose.Schema.Types.ObjectId, ref: 'Novel', required: true },
  chapter: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true }
});

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema],
  total: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);