const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/productModel.js"); // عدلي المسار لو مختلف

dotenv.config();

// ✅ اتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ داتا البست سيلرز
const bestSellers = [
  {
    name: 'Classic Leather Jacket',
    category: 'man',
    price: 149.99,
    image: 'https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Timeless black leather jacket for a bold look.',
    vendor: 'Levi’s',
    bestSeller: true
  },
  {
    name: 'Summer Floral Dress',
    category: 'woman',
    price: 59.99,
    image: 'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Light floral dress perfect for summer days.',
    vendor: 'Zara',
    bestSeller: true
  },
  {
    name: 'Wireless Headphones',
    category: 'electronics',
    price: 129.99,
    image: 'https://images.pexels.com/photos/3394652/pexels-photo-3394652.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Noise-cancelling over-ear wireless headphones.',
    vendor: 'Sony',
    bestSeller: true
  },
  {
    name: 'Running Sneakers',
    category: 'man',
    price: 89.99,
    image: 'https://images.pexels.com/photos/3756042/pexels-photo-3756042.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Lightweight breathable running sneakers.',
    vendor: 'Nike',
    bestSeller: true
  },
  {
    name: 'Kids Denim Jacket',
    category: 'kids',
    price: 39.99,
    image: 'https://images.pexels.com/photos/1007066/pexels-photo-1007066.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Cool denim jacket for kids.',
    vendor: 'H&M',
    bestSeller: true
  },
  {
    name: 'Smartwatch Series 8',
    category: 'electronics',
    price: 249.99,
    image: 'https://images.pexels.com/photos/277394/pexels-photo-277394.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Next-gen smartwatch with fitness and health tracking.',
    vendor: 'Apple',
    bestSeller: true
  },
  {
    name: 'Matte Lipstick Set',
    category: 'beauty',
    price: 29.99,
    image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Set of 5 long-lasting matte lipsticks.',
    vendor: 'Sephora',
    bestSeller: true
  },
  {
    name: 'Women’s Handbag',
    category: 'woman',
    price: 74.99,
    image: 'https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Stylish leather handbag for daily use.',
    vendor: 'Michael Kors',
    bestSeller: true
  }
];

// ✅ حذف المنتجات القديمة وإضافة الجديدة
const seedProducts = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(bestSellers);
    console.log("✅ Best Sellers added successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    process.exit(1);
  }
};

seedProducts();
