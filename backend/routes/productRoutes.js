// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  getActiveCategories,
  getProductById,
  getProductsByVendor,
  getMyProducts,
  updateProduct,
  getPendingProducts,
  adminUpdateProductStatus,
  deleteProduct,
} = require('../controllers/productController');
const { protect, isVendor, isAdmin } = require('../middleware/authMiddleware');
const {
  validateAddProduct,
  validateObjectId,
} = require('../middleware/validationMiddleware');

// --- Public Routes ---
router.route('/').get(getAllProducts);
// vendor products (place before '/:id' to avoid param conflicts)
router.route('/vendor/:vendorId').get(getProductsByVendor);

// vendor's own products (must be before '/:id' so 'myproducts' isn't treated as an id)
router.route('/myproducts').get(protect, isVendor, getMyProducts);

// Admin: get pending products for review
router.route('/admin/pending').get(protect, isAdmin, getPendingProducts);

// Public: get list of active categories
router.route('/categories').get(getActiveCategories);

// Admin: update product status (approve/reject)
router.route('/admin/status/:id').put(protect, isAdmin, validateObjectId('id'), adminUpdateProductStatus);

router.route('/:id').get(validateObjectId('id'), getProductById);

router.route('/').post(protect, isVendor, validateAddProduct, addProduct);

router.route('/:id')
  .put(protect, validateObjectId('id'), updateProduct)
  .delete(protect, validateObjectId('id'), deleteProduct);

module.exports = router;