const express = require('express');
const router = express.Router({ mergeParams: true });
const chapterController = require('../controllers/chapterController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

router.post('/', [
  auth,
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('order').isInt().withMessage('Order must be an integer'),
  validate
], chapterController.addChapter);

// ... autres routes

module.exports = router;