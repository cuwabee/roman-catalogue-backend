const { body } = require('express-validator');

exports.validatePreferences = [
  body('favoriteGenres').isArray().withMessage('Favorite genres must be an array')
];

exports.validateReadList = [
  body('novelId').isMongoId().withMessage('Invalid novel ID')
];