const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config();

const run = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    const users = await User.find({}).lean();
    console.log('USERS:', users);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
