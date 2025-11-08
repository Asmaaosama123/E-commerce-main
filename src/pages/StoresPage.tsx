import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Search, ChevronLeft } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { stores } from "../data/storesData";
import { useCart } from "../contexts/CartContext";

const StoresPage: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const { state, getCartTotal, dispatch } = useCart();

  const filteredStores = stores.filter(
    (store) =>
      (!category ||
        store.tagline.toLowerCase() === category.toLowerCase()) &&
      store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (productId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="sticky top-0 bg-white z-50 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
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

          <h1 className="text-base font-semibold uppercase tracking-wide">
            Stores
          </h1>

          <div className="w-6 h-6"></div>
        </div>
        </div>

      <div className="p-4 flex items-center gap-3">
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 flex-1">
          <Search className="text-gray-400 w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search stores..."
            className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={category || ""}
          onChange={(e) => navigate(`/stores/${e.target.value}`)}
          className="border border-gray-200 rounded-full bg-white text-sm px-3 py-2 outline-none text-gray-700"
        >
          <option value="">All</option>
          <option value="trends">Trends</option>
          <option value="fashion">Fashion</option>
          <option value="trendy">Trendy</option>
        </select>
      </div>

      <main className="p-4 space-y-8">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div
              key={store.id}
              className="overflow-hidden cursor-pointer bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div
                className="flex items-center gap-4 p-4"
                onClick={() => navigate(`/store/${store.id}`)} // ✅ هنا بيروح للصفحة الجديدة
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex flex-col justify-center">
                    <p className="text-gray-800 font-semibold leading-tight">
                      {store.name}
                    </p>
                    <p className="text-sm text-gray-400 leading-tight">
                      {store.tagline}
                    </p>
                  </div>
                  <ChevronRight className="text-gray-500 w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-4 border-t border-gray-100">
                {store.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col items-center justify-start p-3 border-r border-gray-100 last:border-none hover:bg-gray-50 transition-colors"
                    onClick={(e) => handleProductClick(product.id, e)}
                  >
                    <div className="w-20 h-20 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mt-2 leading-none text-center">
                      {product.price} MRU
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No stores found.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                navigate("/stores");
              }}
              className="text-blue-600 text-sm mt-2 hover:text-blue-700"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      <BottomNav
            cartItemCount={state.items.reduce(
              (total, item) => total + item.quantity,
              0
            )}
          />
              </div>
  );
};

export default StoresPage;
