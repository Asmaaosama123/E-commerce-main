const Product = require('../models/productModel');
const Vendor = require('../models/vendorModel');

/**
 * @desc    Get pending products for admin review
 * @route   GET /api/products/admin/pending
 * @access  Private (Admin)
 */
const getPendingProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ status: 'pending' }).populate({ path: 'vendor', select: 'storeName' });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin update product status (approve/reject/archive)
 * @route   PUT /api/products/admin/status/:id
 * @access  Private (Admin)
 */
const adminUpdateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['available', 'rejected', 'archived', 'pending'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.status = status;
    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Vendor only)
 */
const addProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    
    const vendorId = req.user.vendorDetails;

    if (!vendorId) {
      return res.status(401).json({ message: 'Authentication invalid: No vendor details found in token.' });
    }

    const productExists = await Product.findOne({ name, vendor: vendorId });
    if (productExists) {
      return res.status(400).json({ message: 'لقد قمت بإضافة هذا المنتج من قبل' });
    }

    const product = await Product.create({
      vendor: vendorId,
      name,
      description,
      price,
      category,
      stock,
      images,
      status: 'pending',
    });
    res.status(201).json({ message: 'تمت إضافة المنتج بنجاح', product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch all products with pagination
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res, next) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? String(req.query.keyword).trim() : '';

  // Only show products that have been approved by admin.
  // The admin workflow sets approved products to status 'available'.
  const baseFilter = { status: 'available' };
    const keywordFilter = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};
    const filter = { ...baseFilter, ...keywordFilter };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter).populate('vendor', 'storeName').limit(pageSize).skip(pageSize * (page - 1));
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'vendor',
        select: 'storeName storeDescription user vendorType status',
        populate: { path: 'user', select: 'name' },
      });

    if (!product) {
      res.status(404);
      throw new Error('المنتج غير موجود');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product (by Owner or Admin)
 * @route   PUT /api/products/:id
 * @access  Private (Owner Vendor or Admin)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('المنتج غير موجود');
    }

    // Security Check: Allow if user is an Admin OR the product owner
    if (req.user.role !== 'admin') {
      if (!req.user.vendorDetails || product.vendor.toString() !== req.user.vendorDetails.toString()) {
        res.status(401);
        throw new Error('غير مصرح لك بتعديل هذا المنتج');
      }
    }

    const { name, description, price, category, stock, images, status } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.images = images || product.images;
    product.status = status || product.status;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product (by Owner or Admin)
 * @route   DELETE /api/products/:id
 * @access  Private (Owner Vendor or Admin)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('المنتج غير موجود');
    }

    // Security Check: Allow if user is an Admin OR the product owner
    if (req.user.role !== 'admin') {
      if (!req.user.vendorDetails || product.vendor.toString() !== req.user.vendorDetails.toString()) {
        res.status(401);
        throw new Error('غير مصرح لك بحذف هذا المنتج');
      }
    }

    await product.deleteOne();
    res.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    next(error);
  }
};

  /**
    * @desc    Fetch products for a specific vendor and return vendor details
    * @route   GET /api/products/vendor/:vendorId
    * @access  Public
    */
  const getProductsByVendor = async (req, res, next) => {
    try {
      const { vendorId } = req.params;
      if (!vendorId) {
        res.status(400);
        throw new Error('vendorId is required');
      }

      const vendor = await Vendor.findById(vendorId).select('storeName storeDescription user');
      if (!vendor) {
        res.status(404);
        throw new Error('Vendor not found');
      }

      const products = await Product.find({ vendor: vendorId }).populate({ path: 'vendor', select: 'storeName storeDescription' });

      res.json({ vendor, products });
    } catch (error) {
      next(error);
    }
  };

    /**
      * @desc    Fetch products for the logged-in vendor (all statuses)
      * @route   GET /api/products/myproducts
      * @access  Private (Vendor)
      */
    const getMyProducts = async (req, res, next) => {
      try {
        const vendorId = req.user.vendorDetails;

        if (!vendorId) {
          return res.status(400).json({ message: 'Authentication invalid: No vendor details found in token.' });
        }

        const products = await Product.find({ vendor: vendorId }).populate({ path: 'vendor', select: 'storeName storeLogoUrl storeCoverUrl' });
        res.json({ products });
      } catch (error) {
        next(error);
      }
    };
    /**
     * @desc    Get active categories (unique)
     * @route   GET /api/products/categories
     * @access  Public
     */
    const getActiveCategories = async (req, res, next) => {
      try {
        // Use Mongo distinct to return unique category strings for active products
        // Return distinct categories for products that are approved/visible to customers
        const categories = await Product.distinct('category', { status: 'available' });
        // Ensure we return an array of strings
        res.json({ categories: categories || [] });
      } catch (error) {
        next(error);
      }
    };

    module.exports = {
      addProduct,
      getAllProducts,
      getProductById,
      getProductsByVendor,
      getMyProducts,
      updateProduct,
      getPendingProducts,
      adminUpdateProductStatus,
      deleteProduct,
      getActiveCategories,
    };