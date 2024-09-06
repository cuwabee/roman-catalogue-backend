const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

router.post('/', [
  auth,
  body('content').notEmpty().withMessage('Content is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  validate
], commentController.addComment);

router.get('/', commentController.getComments);

router.put('/:commentId', [
  auth,
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  validate
], commentController.updateComment);

router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;