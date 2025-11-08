const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  storeName: { type: String, required: true, trim: true },
  storeDescription: { type: String, required: true },
  vendorType: { type: String, required: true, enum: ['regular', 'vip'], default: 'regular' },
  commissionRate: { type: Number, required: true, default: 15 },
  status: { type: String, enum: ['active', 'frozen'], default: 'active' },
  // Store customization
  storeLogoUrl: { type: String },
  storeCoverUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);