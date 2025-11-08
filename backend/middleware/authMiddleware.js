// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * @desc    Protect routes by verifying JWT
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-otp -otpExpires');

      if (!req.user) {
        return res.status(401).json({ message: 'المستخدم صاحب هذا التوكن لم يعد موجودًا' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'غير مصرح لك بالدخول، التوكن غير صالح' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'غير مصرح لك بالدخول، لا يوجد توكن' });
  }
};

/**
 * @desc    Higher-order middleware to authorize specific roles
 * @param   {...string} roles - List of allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'ليس لديك الصلاحية للقيام بهذا الإجراء' });
    }
    next();
  };
};

// Specific role middlewares built using the generic authorize function
const isVendor = authorize('vendor');
const isAdmin = authorize('admin');

module.exports = { protect, authorize, isVendor, isAdmin };