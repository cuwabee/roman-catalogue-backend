const Novel = require('../models/novel.model');
const User = require('../models/user.model');

exports.getRecommendations = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Get novels from user's favorite genres
  const genreNovels = await Novel.find({
    genre: { $in: user.favoriteGenres },
    _id: { $nin: user.readNovels }
  }).limit(5);

  // Get highly rated novels
  const highlyRatedNovels = await Novel.find({
    averageRating: { $gte: 4 },
    _id: { $nin: user.readNovels }
  }).limit(5);

  // Combine and shuffle recommendations
  const recommendations = [...genreNovels, ...highlyRatedNovels]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  return recommendations;
};