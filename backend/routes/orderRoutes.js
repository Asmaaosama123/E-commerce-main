// routes/orderRoutes.js
const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');

const { protect, isVendor, isAdmin } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validationMiddleware');

// @desc    Create a new order
router.route('/').post(protect, createOrder);

// @desc    Get all orders for the logged-in vendor
router.route('/myorders').get(protect, isVendor, getMyOrders);

// @desc    Get all orders in the system
router.route('/').get(protect, isAdmin, getAllOrders);

// @desc    Update order status
router.route('/:id/status').put(protect, validateObjectId('id'), updateOrderStatus);

module.exports = router;