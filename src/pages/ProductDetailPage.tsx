// src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Heart,
  Share,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  Store,
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import { stores } from "../data/storesData";
import { useCart } from "../contexts/CartContext";

// ✅ نفس الداتا القديمة بالكامل (ما اتحذفتش)
const allProducts: { [key: string]: Product } = {
  "1": {
    id: "1",
    name: "Classic White T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    store: "Fashion Store",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    description:
      "Premium cotton t-shirt with perfect fit. Made from 100% organic cotton for maximum comfort and durability.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Black", value: "#000000" },
      { name: "Navy", value: "#1E3A8A" },
      { name: "Gray", value: "#6B7280" },
    ],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500",
      "https://images.unsplash.com/photo-1503342217505-b8c4d6c6d7d1?w=500",
    ],
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    features: [
      "100% Organic Cotton",
      "Machine Washable",
      "Premium Fit",
      "Eco-Friendly",
    ],
    category: "Clothing",
    isNew: true,
  },
  "2": {
    id: "2",
    name: "Slim Fit Jeans",
    price: 79.99,
    store: "Denim Co.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    description:
      "Modern slim fit jeans with stretch technology for ultimate comfort and style.",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { name: "Dark Blue", value: "#1E3A8A" },
      { name: "Black", value: "#000000" },
      { name: "Light Blue", value: "#60A5FA" },
    ],
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500",
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500",
    ],
    rating: 4.2,
    reviewCount: 89,
    inStock: true,
    features: ["Stretch Denim", "Slim Fit", "Machine Wash", "5 Pockets"],
    category: "Clothing",
    isNew: false,
  },
  "3": {
    id: "3",
    name: "Winter Jacket",
    price: 129.99,
    originalPrice: 159.99,
    store: "Outdoor Gear",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    description:
      "Warm and stylish winter jacket perfect for cold weather conditions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Red", value: "#DC2626" },
      { name: "Blue", value: "#2563EB" },
      { name: "Green", value: "#059669" },
    ],
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    ],
    rating: 4.8,
    reviewCount: 204,
    inStock: true,
    features: ["Waterproof", "Windproof", "Insulated", "Multiple Pockets"],
    category: "Outerwear",
    isNew: true,
  },
  "easithlete-1": {
    id: "easithlete-1",
    name: "Smart Running Shoes",
    price: 31.7,
    originalPrice: 39.99,
    store: "Easithlete",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    description:
      "High-performance running shoes with advanced cushioning technology for maximum comfort during long runs.",
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Blue", value: "#2563EB" },
      { name: "Red", value: "#DC2626" },
    ],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80",
    ],
    rating: 4.4,
    reviewCount: 89,
    inStock: true,
    features: ["Lightweight", "Breathable", "Shock Absorption", "Durable"],
    category: "Shoes",
    isNew: false,
  },
  "easithlete-2": {
    id: "easithlete-2",
    name: "Sports Watch",
    price: 10.93,
    store: "Easithlete",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    description:
      "Feature-packed sports watch with heart rate monitoring and GPS tracking.",
    sizes: ["One Size"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Silver", value: "#9CA3AF" },
    ],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1434493652601-125ec345df8a?auto=format&fit=crop&w=600&q=80",
    ],
    rating: 4.2,
    reviewCount: 67,
    inStock: true,
    features: ["Heart Rate Monitor", "GPS", "Water Resistant", "Long Battery"],
    category: "Accessories",
    isNew: true,
  },
  "urban-1": {
    id: "urban-1",
    name: "Denim Jacket",
    price: 25.99,
    originalPrice: 34.99,
    store: "Urban Wear",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
    description:
      "Classic denim jacket with modern fit and vintage wash for timeless style.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Light Blue", value: "#93C5FD" },
      { name: "Dark Blue", value: "#1E3A8A" },
    ],
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551028711-129a12711062?auto=format&fit=crop&w=600&q=80",
    ],
    rating: 4.3,
    reviewCount: 78,
    inStock: true,
    features: ["100% Cotton", "Vintage Wash", "Modern Fit", "Machine Wash"],
    category: "Clothing",
    isNew: false,
  },
  "urban-2": {
    id: "urban-2",
    name: "Casual T-Shirt",
    price: 18.5,
    store: "Urban Wear",
    image:
      "https://images.unsplash.com/photo-1588099768531-a72d4a198538?auto=format&fit=crop&w=600&q=80",
    description:
      "Comfortable cotton t-shirt perfect for everyday wear and casual outings.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Black", value: "#000000" },
      { name: "Gray", value: "#6B7280" },
    ],
    images: [
      "https://images.unsplash.com/photo-1588099768531-a72d4a198538?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    ],
    rating: 4.0,
    reviewCount: 45,
    inStock: true,
    features: ["100% Cotton", "Premium Fit", "Breathable", "Easy Care"],
    category: "Clothing",
    isNew: true,
  },
};

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { state, getCartTotal, dispatch } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (productId && allProducts[productId]) {
      const found = allProducts[productId];
      setProduct(found);
      if (found.sizes?.length) setSelectedSize(found.sizes[0]);
      if (found.colors?.length) setSelectedColor(found.colors[0].name);
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>Loading product...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    const newItem: CartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      product,
      quantity,
      size: selectedSize,
      color: selectedColor,
    };
    dispatch({ type: "ADD_ITEM", payload: newItem });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const goToStore = () => {
    const targetStore = stores.find((s) => s.name === product.store);
    if (targetStore) navigate(`/store/${targetStore.id}`);
  };
    const goToOffers = () => navigate("/OffersPage");

  const offerProducts = Object.values(allProducts).filter(
    (p) => p.originalPrice && p.originalPrice > p.price
  );

  return (
    <div className="flex flex-col min-h-screen bg-white relative pb-[120px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
  <button
    onClick={() => navigate(-1)}
    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
  >
    <svg
      className="w-5 h-5 text-gray-700"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  </button>

  <h2 className="text-base font-semibold uppercase tracking-wide">
    {product.name}
  </h2>

  <div className="flex items-center gap-3">
    <Heart className="w-5 h-5 text-gray-600" />
    <Share className="w-5 h-5 text-gray-600" />
  </div>
</div>


      {/* Image */}
      <div className="relative">
        <img
          src={product.images[activeImageIndex]}
          alt={product.name}
          className="w-full h-[350px] object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-yellow-600 font-bold text-2xl">${product.price}</p>
          {product.originalPrice && (
            <p className="text-red-500 line-through">${product.originalPrice}</p>
          )}
        </div>

        {/* Color */}
        {/* Color */}
{product.colors?.length > 0 && (
  <div>
    <h4 className="font-semibold mb-2 text-gray-700 text-sm uppercase">
      Color
    </h4>
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {product.colors.map((c, index) => (
        <div key={c.name} className="flex flex-col items-center">
          <button
            onClick={() => {
              setSelectedColor(c.name);
              setActiveImageIndex(index < product.images.length ? index : 0);
            }}
            className={`border-2 rounded-lg overflow-hidden transition-all ${
              selectedColor === c.name
                ? "border-yellow-500 scale-105"
                : "border-gray-200"
            }`}
          >
            <img
              src={product.images[index] || product.image}
              alt={c.name}
              className="w-16 h-16 object-cover"
            />
          </button>
          <span
            className={`text-xs mt-1 ${
              selectedColor === c.name ? "text-yellow-600 font-semibold" : "text-gray-600"
            }`}
          >
          </span>
        </div>
      ))}
    </div>
  </div>
)}


        {/* Size */}
        {product.sizes?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-gray-700 text-sm uppercase">
              Size
            </h4>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`border text-sm font-medium px-3 py-1 rounded-md transition ${
                    selectedSize === s
                      ? "border-yellow-500 bg-yellow-100 text-yellow-700"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 bg-gray-200 rounded-full"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 bg-gray-200 rounded-full"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Store Button */}
       {/* Store Button */}
<button
  onClick={goToStore}
  className="flex items-center justify-between w-full border-t border-b border-gray-200 py-3"
>
  <div className="flex items-center gap-2">
    <Store className="w-5 h-5 text-gray-600" />
    <span className="font-medium text-gray-700">{product.store}</span>
  </div>
  {/* السهم */}
  <span className="text-gray-400 font-bold text-lg">&gt;</span>
</button>


        {/* Offers Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-gray-800">Hot Offers</h4>
            <button
              onClick={goToOffers}
              className="text-yellow-600 text-sm font-semibold"
            >
              View All
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {offerProducts.map((offer) => (
              <div
                key={offer.id}
                onClick={() => navigate(`/product/${offer.id}`)}
                className="min-w-[160px] bg-gray-50 rounded-xl shadow-sm p-2 cursor-pointer hover:shadow-md transition"
              >
                <img
                  src={offer.image}
                  alt={offer.name}
                  className="w-full h-[140px] object-cover rounded-lg"
                />
                <p className="font-semibold text-gray-800 mt-1 truncate">
                  {offer.name}
                </p>
                <div className="flex gap-2 items-center">
                  <span className="text-yellow-600 font-bold">
                    ${offer.price}
                  </span>
                  {offer.originalPrice && (
                    <span className="text-red-500 line-through text-sm">
                      ${offer.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="fixed bottom-[60px] left-0 right-0 bg-white px-4 py-3 border-t border-gray-200 shadow-md">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-lg font-semibold text-white transition ${
            isAdding
              ? "bg-yellow-400 cursor-wait"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {isAdding ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              Adding...
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>
      </div>

      <BottomNav
            cartItemCount={state.items.reduce(
              (total, item) => total + item.quantity,
              0
            )}
          />

    </div>
  );
};

export default ProductDetailPage;