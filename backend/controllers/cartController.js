// controllers/cartController.js
const User = require('../models/userModel');
const Product = require('../models/productModel');

/**
 * @desc    Add item to cart or update quantity
 * @route   POST /api/cart
 * @access  Private (Authenticated Users)
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: 'المنتج غير موجود' });
    }

    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // If item exists, update quantity
      user.cart[itemIndex].qty = qty;
    } else {
      // If item does not exist, add new item to cart
      user.cart.push({ product: productId, qty });
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:productId
 * @access  Private (Authenticated Users)
 */
const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);
        
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        
        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private (Authenticated Users)
 */
const getCart = async (req, res, next) => {
  try {
    // Populate cart.product and within that populate the product.vendor (select only storeName)
    const user = await User.findById(req.user._id)
      .populate({
      path: 'cart.product',
      populate: {
        path: 'vendor',
        select: 'storeName'
      }
      });

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    res.status(200).json(user.cart);
  } catch (error) {
    next(error);
  }
}

module.exports = { addToCart, removeFromCart, getCart };