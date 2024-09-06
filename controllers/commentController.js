const Novel = require('../models/novel.model');

exports.addComment = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    const newComment = {
      user: req.userId,
      content: req.body.content,
      rating: req.body.rating
    };

    novel.comments.push(newComment);
    novel.updateAverageRating();
    await novel.save();

    res.status(201).json(novel.comments[novel.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId).populate('comments.user', 'username');
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    res.json(novel.comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    const comment = novel.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'User not authorized to update this comment' });
    }

    comment.content = req.body.content || comment.content;
    comment.rating = req.body.rating || comment.rating;

    novel.updateAverageRating();
    await novel.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    const comment = novel.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'User not authorized to delete this comment' });
    }

    comment.remove();
    novel.updateAverageRating();
    await novel.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};