// controllers/orderController.js
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Vendor = require('../models/vendorModel');

// @desc    Create a new order
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    // Basic validation to provide clear 4xx responses instead of 500
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'لا توجد منتجات في الطلب' });
    }
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({ message: 'مطلوب عنوان الشحن (address و city)' });
    }

    // Sanitize and ensure orderItems contain required fields
    const sanitizedItems = orderItems.map((it) => {
      const productId = (it.product && (it.product._id || it.product)) || it.product;
      return {
        product: productId,
        name: String(it.name || 'Product'),
        qty: Number(it.qty || it.quantity || 1),
        price: Number(it.price || 0),
        image: String(it.image || ''),
      };
    });

    // Create order using sanitized payload
    const order = new Order({ user: req.user._id, orderItems: sanitizedItems, shippingAddress, paymentMethod, totalPrice });
    const createdOrder = await order.save();

    // Decrement stock for each created order item. Use createdOrder.orderItems to ensure we use the saved data.
    await Promise.all(createdOrder.orderItems.map(async (item) => {
      try {
        // item.product may be an ObjectId or an object with _id
        const prodId = (item.product && (item.product._id || item.product)) || item.product;
        if (prodId) {
          await Product.findByIdAndUpdate(prodId, { $inc: { stock: -item.qty } });
        }
      } catch (err) {
        // Log and continue — stock update failure should not prevent order creation
        console.error('Failed to decrement stock for product', item.product, err.message || err);
      }
    }));

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in vendor's orders
const getMyOrders = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: 'لم يتم العثور على بيانات التاجر' });
    }
    const vendorProducts = await Product.find({ vendor: vendor._id }).select('_id');
    const productIds = vendorProducts.map(p => p._id);
    const orders = await Order.find({ 'orderItems.product': { $in: productIds } }).populate('user', 'name whatsapp');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (by Vendor or Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404); throw new Error('الطلب غير موجود');
    }
    
    // Security check: Admins can update any order. Vendors can only update their own.
    if (req.user.role === 'vendor') {
        const vendor = await Vendor.findOne({ user: req.user._id });
        const vendorProducts = await Product.find({ vendor: vendor._id }).select('_id');
        const productIds = vendorProducts.map(p => p._id.toString());
        const isOrderOwner = order.orderItems.some(item => productIds.includes(item.product.toString()));

        if (!isOrderOwner) {
            res.status(401); throw new Error('غير مصرح لك بتحديث هذا الطلب');
        }
    }

    order.status = req.body.status || order.status;
    if (req.body.status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
const getAllOrders = async (req, res, next) => {
  try {
    // Deep populate: user (name, whatsapp), each orderItems.product and inside product the vendor.storeName
    const orders = await Order.find({})
      .populate('user', 'name whatsapp')
      .populate({
        path: 'orderItems.product',
        model: 'Product',
        select: 'name price vendor',
        populate: { path: 'vendor', model: 'Vendor', select: 'storeName' }
      });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, updateOrderStatus, getAllOrders };