const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const axios = require('axios');

/**
 * @desc    Request an OTP (currently in test mode)
 * @route   POST /api/auth/request-otp
 * @access  Public
 */
const requestOTP = async (req, res, next) => {
  try {
    const { whatsapp, name } = req.body;
    let user = await User.findOne({ whatsapp });

    if (!user) {
      const newUser = new User({ name: name ? String(name) : 'مستخدم جديد', whatsapp: String(whatsapp), role: 'customer' });
      user = await newUser.save();
    } else {
      if ((!user.name || user.name.trim() === '') && name) {
        user.name = String(name);
      }
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity
    await user.save();
    
    /*
    // --- Beem Africa API Call is temporarily disabled due to timeout error ---
    const apiKey = process.env.BEEM_API_KEY;
    const secretKey = process.env.BEEM_SECRET_KEY;
    const senderName = process.env.BEEM_SENDER_NAME;

    if (!apiKey || !secretKey || !senderName) {
        console.error('Beem Africa credentials are not set in .env file');
        throw new Error('فشل إرسال كود التفعيل بسبب مشكلة في الإعدادات');
    }

    const message = `Your activation code is: ${otp}`;
    const recipientNumber = whatsapp.startsWith('+') ? whatsapp.substring(1) : whatsapp;

    await axios.post(
      'https://apisms.beem.africa/v1/send',
      {
        source_addr: senderName,
        encoding: 0,
        message: message,
        recipients: [ { recipient_id: '1', dest_addr: recipientNumber } ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${secretKey}`).toString('base64')
        },
      }
    );
    */

    console.log(`OTP for ${whatsapp}: ${otp}`);

    res.status(200).json({ message: 'تم إرسال كود التفعيل بنجاح (وضع الاختبار)' });
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
    next(new Error('فشل إرسال كود التفعيل، الرجاء المحاولة مرة أخرى'));
  }
};

/**
 * @desc    Verify OTP and issue a token
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { whatsapp, otp } = req.body;
    
    const user = await User.findOne({
      whatsapp,
      otp,
      otpExpires: { $gt: Date.now() },
    }); // We don't .populate here.

    if (!user) {
      return res.status(400).json({ message: 'الكود غير صحيح أو انتهت صلاحيته' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        vendorDetails: user.vendorDetails // This is just the ID, which is correct
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        vendorDetails: user.vendorDetails || null, // Send the ID to the frontend
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { requestOTP, verifyOTP };