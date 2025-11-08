// models/userModel.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    default: 1,
  },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  whatsapp: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
  otp: { type: String },
  otpExpires: { type: Date },
  vendorDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  
  cart: [cartItemSchema],

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);