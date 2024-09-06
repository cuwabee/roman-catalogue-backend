const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  price: { type: Number, required: true },
  order: { type: Number, required: true }
});

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true }
}, { timestamps: true });

const NovelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  chapters: [ChapterSchema],
  comments: [CommentSchema],
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

NovelSchema.methods.updateAverageRating = function() {
  const totalRating = this.comments.reduce((sum, comment) => sum + comment.rating, 0);
  this.averageRating = this.comments.length > 0 ? totalRating / this.comments.length : 0;
};

NovelSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Novel', NovelSchema);