import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Share2, Search, ShoppingCart } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { stores } from "../data/storesData";
import { useCart } from "../contexts/CartContext";

const StoreDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { state, getCartTotal, dispatch } = useCart();

  const store = stores.find((s) => s.id.toString() === storeId);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (store?.categories?.length) {
      setSelectedCategory(store.categories[0].name); // أول كاتيجوري افتراضيًا
    }
  }, [store]);

  if (!store)
    return (
      <div className="p-4 text-center text-gray-500">Store not found</div>
    );

  const filteredProducts =
    selectedCategory && selectedCategory !== ""
      ? store.products.filter(
          (p) =>
            p.category?.toLowerCase() === selectedCategory.toLowerCase()
        )
      : store.products;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 🏪 Cover section */}
      <div className="relative w-full h-56 md:h-64">
        <img
          src={store.cover || "https://via.placeholder.com/600x300"}
          alt={store.name}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Top Bar */}
        <div className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          {/* Search */}
          <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full px-3 py-2 w-2/3 shadow-sm">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search on store name"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 ml-2"
            />
          </div>

          <button className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm">
            <Share2 className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* Store info */}
        <div className="absolute bottom-3 left-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden border border-white shadow">
            <img
              src={store.logo || "https://via.placeholder.com/60"}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg leading-tight">
              {store.name}
            </h2>
            <p className="text-gray-200 text-sm">
              {store.products.length} items
            </p>
          </div>
        </div>
      </div>

      {/* 🧩 Category bar (scrollable like subcategory) */}
      <div className="bg-white py-3 border-b border-gray-200">
        <div className="flex overflow-x-auto space-x-4 px-4 no-scrollbar">
          {store.categories?.map((cat, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-20 text-center cursor-pointer"
              onClick={() => setSelectedCategory(cat.name)}
            >
              <div
                className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedCategory === cat.name
                    ? "border-black"
                    : "border-gray-200"
                } bg-gray-100 mb-1 transition`}
              >
                <img
                  src={cat.image || "https://via.placeholder.com/100"}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p
                className={`text-xs font-medium truncate ${
                  selectedCategory === cat.name
                    ? "text-black"
                    : "text-gray-700"
                }`}
              >
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🛍️ Products grid */}
      <div className="px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="aspect-[4/5] bg-gray-100 relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm text-gray-700 line-clamp-2">{p.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-gray-900">
                    {p.price} MRU
                  </span>
                  <button className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products found in this category.
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
            cartItemCount={state.items.reduce(
              (total, item) => total + item.quantity,
              0
            )}
          />    </div>
  );
};

export default StoreDetailPage;
