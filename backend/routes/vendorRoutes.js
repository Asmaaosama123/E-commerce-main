const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/vendorController');
const { protect, isVendor } = require('../middleware/authMiddleware');

// PUT /api/vendor/profile - update vendor profile (logo/cover)
router.route('/profile').put(protect, isVendor, updateProfile);

module.exports = router;
