const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

router.get('/', auth, cartController.getCart);
router.post('/add', [
  auth,
  body('novelId').isMongoId().withMessage('Invalid novel ID'),
  body('chapterId').isMongoId().withMessage('Invalid chapter ID'),
  validate
], cartController.addToCart);
router.delete('/remove/:itemId', auth, cartController.removeFromCart);
router.delete('/clear', auth, cartController.clearCart);

module.exports = router;