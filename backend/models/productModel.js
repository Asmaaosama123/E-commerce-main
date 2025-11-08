const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Vendor' },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String, required: true }],
  // Product lifecycle states:
  // - pending: newly created by vendor and awaiting admin review
  // - available: approved by admin and visible in the catalog
  // - rejected: admin rejected the product
  // - archived: removed from catalog but retained historically
  status: { type: String, enum: ['pending', 'available', 'rejected', 'archived'], default: 'pending' },
}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);