const Vendor = require('../models/vendorModel');

/**
 * @desc    Update vendor profile (store logo and cover)
 * @route   PUT /api/vendor/profile
 * @access  Private (Vendor)
 */
const updateProfile = async (req, res, next) => {
  try {
    const { storeLogoUrl, storeCoverUrl, storeName, storeDescription } = req.body;

    let vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      res.status(404);
      throw new Error('Vendor profile not found');
    }

    if (storeLogoUrl !== undefined) vendor.storeLogoUrl = storeLogoUrl;
    if (storeCoverUrl !== undefined) vendor.storeCoverUrl = storeCoverUrl;
    if (storeName !== undefined) vendor.storeName = storeName;
    if (storeDescription !== undefined) vendor.storeDescription = storeDescription;

    await vendor.save();
    res.json({ message: 'Vendor profile updated', vendor });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile };
