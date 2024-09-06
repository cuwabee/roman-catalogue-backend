const { query } = require('express-validator');

exports.validateSearchParams = [
  query('query').optional().isString(),
  query('genre').optional().isString(),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
  query('sortBy').optional().isIn(['rating', 'date']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
];