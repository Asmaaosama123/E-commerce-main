const User = require('../models/userModel');
const Vendor = require('../models/vendorModel');
const Product = require('../models/productModel'); // <-- تم التأكد من وجود هذا السطر
const Order = require('../models/orderModel');     // <-- تم التأكد من وجود هذا السطر

/**
 * @desc    Create a new vendor account
 * @route   POST /api/admin/vendors
 * @access  Private (Admin)
 */
const createVendor = async (req, res, next) => {
  try {
    const { name, whatsapp, storeName, storeDescription, vendorType } = req.body;
    const userExists = await User.findOne({ whatsapp });
    if (userExists) {
      return res.status(400).json({ message: 'هذا الرقم مسجل بالفعل' });
    }
  const user = await User.create({ name, whatsapp, role: 'vendor' });
  // Normalize vendorType and apply commission rates: vip -> 5%, regular -> 15%
  const normalizedType = (vendorType || 'regular').toString().toLowerCase();
  const commissionRate = normalizedType === 'vip' ? 5 : 15;
    const vendor = await Vendor.create({ user: user._id, storeName, storeDescription, vendorType, commissionRate });
    user.vendorDetails = vendor._id;
    await user.save();
    res.status(201).json({ message: 'تم إنشاء حساب التاجر بنجاح', vendor });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all vendors
 * @route   GET /api/admin/vendors
 * @access  Private (Admin)
 */
const getAllVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find({}).populate('user', 'name whatsapp createdAt');
    res.json(vendors);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update vendor status
 * @route   PUT /api/admin/vendors/:id/status
 * @access  Private (Admin)
 */
const updateVendorStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      res.status(404);
      throw new Error('التاجر غير موجود');
    }
    vendor.status = status;
    await vendor.save();
    res.json({ message: 'تم تحديث حالة التاجر بنجاح', vendor });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a vendor's details
 * @route   PUT /api/admin/vendors/:id
 * @access  Private (Admin)
 */
const updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      res.status(404);
      throw new Error('التاجر غير موجود');
    }
    vendor.storeName = req.body.storeName || vendor.storeName;
    vendor.description = req.body.description || vendor.description;
    vendor.commissionRate = req.body.commissionRate ?? vendor.commissionRate;
    const updatedVendor = await vendor.save();
    res.json(updatedVendor);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
const getDashboardStats = async (req, res, next) => {
    try {
        const totalSellers = await Vendor.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        const totalOrders = await Order.countDocuments({});

    // Total revenue is based on historical completed orders and is independent of the current product catalog.
    // For example, deleting a product from the catalog should NOT change reported historical revenue.
    // Use aggregation to compute total revenue on the server (more efficient than fetching all orders)
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

        const totalRevenue = (revenueResult[0] && revenueResult[0].totalRevenue) || 0;

        res.json({ totalSellers, totalProducts, totalOrders, totalRevenue });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a product's details
 * @route   PUT /api/admin/products/:id
 * @access  Private (Admin)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.price = req.body.price ?? product.price;
    product.category = req.body.category ?? product.category;
    product.stock = req.body.stock ?? product.stock;
    if (Array.isArray(req.body.images)) product.images = req.body.images;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a user's details
 * @route   PUT /api/admin/users/:id
 * @access  Private (Admin)
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name ?? user.name;
    user.whatsapp = req.body.whatsapp ?? user.whatsapp;
    if (req.body.role && ['customer', 'vendor', 'admin'].includes(req.body.role)) {
      user.role = req.body.role;
    }

    const updated = await user.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

  /**
   * @desc    Delete a user (and associated vendor/products if any)
   * @route   DELETE /api/admin/users/:id
   * @access  Private (Admin)
   */
  const deleteUser = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }

      // If user is a vendor, delete vendor and its products
      if (user.role === 'vendor') {
        const vendor = await Vendor.findOne({ user: user._id });
        if (vendor) {
          // delete products belonging to this vendor
          await Product.deleteMany({ vendor: vendor._id });
          await vendor.deleteOne();
        }
      }

      await user.deleteOne();
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

module.exports = { 
  createVendor, 
  getAllVendors, 
  updateVendorStatus, 
  updateVendor,
  getDashboardStats,
  updateProduct,
  updateUser,
  deleteUser,
};