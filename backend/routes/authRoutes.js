const express = require('express');
const router = express.Router();
const { requestOTP, verifyOTP } = require('../controllers/authController');
const { validateRequestOtp, validateVerifyOtp } = require('../middleware/validationMiddleware');

router.post('/request-otp', validateRequestOtp, requestOTP);
router.post('/verify-otp', validateVerifyOtp, verifyOTP);

module.exports = router;