import React from "react";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product, onClick, onAddToCart }) => {
  return (
    <div
      onClick={onClick}
      className="relative bg-white/70 backdrop-blur-lg rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 group"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Top Label */}
        {product.label && (
          <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
            {product.label}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </h3>

        {/* Bestseller Tag */}
        {product.isBestseller && (
          <p className="text-xs text-yellow-600 font-semibold mt-1">
            #1 Bestseller in {product.category}
          </p>
        )}

        {/* Price & Sales */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-900 font-bold text-base">
            ج.م {product.price.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">{product.sold}+ sold</p>
        </div>
      </div>

      {/* Add to cart icon */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
        className="absolute bottom-3 right-3 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
      >
        <ShoppingCart size={18} />
      </button>
    </div>
  );
};

export default ProductCard;
