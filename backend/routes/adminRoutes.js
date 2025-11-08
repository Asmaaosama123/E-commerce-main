const express = require('express');
const router = express.Router();
const {
  createVendor,
  getAllVendors,
  updateVendorStatus,
  updateVendor,
  getDashboardStats
} = require('../controllers/adminController');
const { deleteUser } = require('../controllers/adminController');
const { updateProduct, updateUser } = require('../controllers/adminController');
const { validateCreateVendor, validateObjectId } = require('../middleware/validationMiddleware');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

// --- Routes for Statistics ---
router.get('/stats', getDashboardStats);

// --- Routes for Vendor Management ---
router.route('/vendors')
  .get(getAllVendors); // GET /api/admin/vendors (To get all vendors)

router.route('/vendors/:id')
  .put(validateObjectId('id'), updateVendor); // PUT /api/admin/vendors/:id (To update a vendor)

// Products update (admin)
router.route('/products/:id')
  .put(validateObjectId('id'), updateProduct);

// Users update (admin)
router.route('/users/:id')
  .put(validateObjectId('id'), updateUser);

// Delete a user (admin)
router.route('/users/:id')
  .delete(validateObjectId('id'), deleteUser);

router.route('/vendors/:id/status')
  .put(validateObjectId('id'), updateVendorStatus); // PUT /api/admin/vendors/:id/status (To update status)

// --- THIS IS THE CORRECTED ROUTE ---
// POST /api/admin/create-vendor (To create a new vendor)
router.post('/create-vendor', validateCreateVendor, createVendor);


module.exports = router;