// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { addToCart, removeFromCart, getCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes are protected
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart);

router.route('/:productId').delete(removeFromCart);

module.exports = router;