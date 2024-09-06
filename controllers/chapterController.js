const Novel = require('../models/novel.model');

exports.addChapter = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    novel.chapters.push(req.body);
    await novel.save();
    res.status(201).json(novel.chapters[novel.chapters.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding chapter', error: error.message });
  }
};

exports.getChapters = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    res.json(novel.chapters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chapters', error: error.message });
  }
};

exports.getChapter = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    const chapter = novel.chapters.id(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chapter', error: error.message });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    const chapter = novel.chapters.id(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    Object.assign(chapter, req.body);
    await novel.save();
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: 'Error updating chapter', error: error.message });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    novel.chapters.id(req.params.chapterId).remove();
    await novel.save();
    res.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting chapter', error: error.message });
  }
};