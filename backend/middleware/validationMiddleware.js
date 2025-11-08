// middleware/validationMiddleware.js


const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateWhatsappNumber = body('whatsapp', 'الرجاء إدخال رقم واتساب صحيح بالصيغة الدولية (مثال: +22212345678)')
  .matches(/^\+\d{10,15}$/);

const validateRequestOtp = [
  validateWhatsappNumber,
  handleValidationErrors,
];

const validateVerifyOtp = [
  validateWhatsappNumber,
  body('otp', 'كود التفعيل يجب أن يكون 4 أرقام').isLength({ min: 4, max: 4 }).isNumeric(),
  handleValidationErrors,
];

const validateCreateVendor = [
  body('name', 'اسم التاجر مطلوب').not().isEmpty().trim().escape(),
  validateWhatsappNumber,
  body('storeName', 'اسم المتجر مطلوب').not().isEmpty().trim().escape(),
  body('storeDescription', 'وصف المتجر مطلوب').not().isEmpty().trim().escape(),
  body('vendorType', 'نوع التاجر يجب أن يكون regular أو vip').isIn(['regular', 'vip']),
  handleValidationErrors,
];

const validateAddProduct = [
  body('name', 'اسم المنتج مطلوب').not().isEmpty().trim().escape(),
  body('description', 'وصف المنتج مطلوب').not().isEmpty().trim().escape(),
  body('price', 'السعر يجب أن يكون رقمًا موجبًا').isFloat({ gt: 0 }),
  body('category', 'فئة المنتج مطلوبة').not().isEmpty().trim().escape(),
  body('stock', 'الكمية يجب أن تكون رقمًا صحيحًا').isInt({ gt: -1 }),
  handleValidationErrors,
];

const validateObjectId = (paramName) => [
  param(paramName).custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error(`معرف غير صالح: ${paramName}`);
    }
    return true;
  }),
  handleValidationErrors,
];

module.exports = {
  validateRequestOtp,
  validateVerifyOtp,
  validateCreateVendor,
  validateAddProduct,
  validateObjectId,
};