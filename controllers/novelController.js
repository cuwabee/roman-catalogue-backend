const Novel = require('../models/novel.model');

exports.createNovel = async (req, res) => {
  try {
    const novel = new Novel(req.body);
    await novel.save();
    res.status(201).json(novel);
  } catch (error) {
    res.status(500).json({ message: 'Error creating novel', error: error.message });
  }
};

exports.getNovels = async (req, res) => {
  try {
    const novels = await Novel.find().select('title author description genre averageRating');
    res.json(novels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching novels', error: error.message });
  }
};

exports.getNovelById = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id).populate('comments.user', 'username');
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    res.json(novel);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching novel', error: error.message });
  }
};

exports.updateNovel = async (req, res) => {
  try {
    const novel = await Novel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    res.json(novel);
  } catch (error) {
    res.status(500).json({ message: 'Error updating novel', error: error.message });
  }
};

exports.deleteNovel = async (req, res) => {
  try {
    const novel = await Novel.findByIdAndDelete(req.params.id);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    res.json({ message: 'Novel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting novel', error: error.message });
  }
};

exports.searchNovels = async (req, res) => {
  try {
    const { query, genre, minRating, sortBy, page = 1, limit = 10 } = req.query;
    let filter = {};
    
    if (query) {
      filter.$text = { $search: query };
    }
    
    if (genre) {
      filter.genre = genre;
    }
    
    if (minRating) {
      filter.averageRating = { $gte: parseFloat(minRating) };
    }
    
    let sort = {};
    if (sortBy === 'rating') {
      sort = { averageRating: -1 };
    } else if (sortBy === 'date') {
      sort = { createdAt: -1 };
    }
    
    const novels = await Novel.find(filter)
      .sort(sort)
      .select('title author description genre averageRating')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Novel.countDocuments(filter);
    
    res.json({
      novels,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching novels', error: error.message });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const genres = await Novel.distinct('genre');
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching genres', error: error.message });
  }
};