// src/pages/CategoryHierarchyPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HeroSection from "../components/HeroSection";
import CategoryNav from "../components/CategoryNav";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { useCart } from "../contexts/CartContext";

const BASE = "http://your-api-url.com/api"; // ← غيّريها لعنوان API

const CategoryHierarchyPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState(
    (categoryName || "woman").toLowerCase()
  );

  const { state } = useCart();

  // بيانات من API
  const [categories, setCategories] = useState([]); // الكاتيجورى الرئيسية
  const [subcategories, setSubcategories] = useState([]); // الصب كاتيجورى
  const [offers, setOffers] = useState([]); // الهوت اوفرز
  const [topStores, setTopStores] = useState([]); // المتاجر Top Sellers

  // ⬇️ تحديث الكاتيجورى لما ال URL يتغير
  useEffect(() => {
    setActiveCategory((categoryName || "woman").toLowerCase());
  }, [categoryName]);

  // ⬇️ تحميل الكاتيجورى الرئيسية
  useEffect(() => {
    fetch(`${BASE}/getActiveCategories`)
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  // ⬇️ تحميل الصب كاتيجورى والاوفرز والستورز
  useEffect(() => {
    if (!activeCategory) return;

    // Subcategories
    fetch(`${BASE}/getSubCategories/${activeCategory}`)
      .then((res) => res.json())
      .then((data) => setSubcategories(data.subcategories || []));

    // Offers
    fetch(`${BASE}/getOffersByCategory/${activeCategory}`)
      .then((res) => res.json())
      .then((data) => setOffers(data.products || []));

    // Stores
    fetch(`${BASE}/getStoresByCategory/${activeCategory}`)
      .then((res) => res.json())
      .then((data) => setTopStores(data.vendors || []));
  }, [activeCategory]);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-7xl bg-white min-h-screen">
        <Header
          cartItemCount={state.items.reduce(
            (total, item) => total + item.quantity,
            0
          )}
          onCartClick={() => navigate("/cart")}
          onLogoClick={() =>
            navigate(`/category/${encodeURIComponent(activeCategory)}`)
          }
        />

        {/* CategoryNav */}
        <CategoryNav selectedCategory={activeCategory} categories={categories} />

        {/* Hero Section */}
        <div className="mt-3 px-4 md:px-8">
          <HeroSection category={{ name: activeCategory }} />
        </div>

        <main className="mt-5 px-4 md:px-8 pb-24">
          {/* Collections */}
          <section>
            <h2 className="text-sm md:text-base font-semibold mb-3">
              Collections
            </h2>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {subcategories.map((sub) => (
                <div
                  key={sub}
                  className="cursor-pointer flex flex-col items-center"
                  onClick={() =>
                    navigate(`/category/${activeCategory}/${sub}`)
                  }
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    <span className="text-xs">{sub}</span>
                  </div>
                  <p className="text-xs md:text-sm text-center mt-2 truncate">
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Top Sellers */}
          <section className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm md:text-base font-semibold">Top Sellers</h2>
              <button
                onClick={() => navigate(`/stores/${activeCategory}`)}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {topStores.map((store) => (
                <div
                  key={store._id}
                  onClick={() => navigate(`/store/${store._id}`)}
                  className="bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md p-3 text-center text-sm md:text-base font-medium text-gray-700"
                >
                  {store.storeName}
                </div>
              ))}
            </div>
          </section>

          {/* Offers Section */}
          <section className="mt-8 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm md:text-base font-semibold">
                Products on Offer
              </h2>
              <button
                onClick={() => navigate(`/offers/${activeCategory}`)}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {offers.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="bg-white shadow-sm overflow-hidden cursor-pointer hover:shadow-md"
                >
                  <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {p.originalPrice
                        ? Math.round(
                            ((p.originalPrice - p.price) / p.originalPrice) *
                              100
                          )
                        : 0}
                      % OFF
                    </span>
                  </div>

                  <div className="p-2 text-center">
                    <p className="text-sm md:text-base font-medium truncate w-full">
                      {p.name}
                    </p>

                    <div className="flex justify-center items-baseline mt-1 space-x-2">
                      <span className="text-xs md:text-sm text-gray-400 line-through">
                        MRU {p.originalPrice}
                      </span>
                      <span className="text-sm md:text-base font-semibold text-gray-900">
                        MRU {p.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <div className="fixed bottom-0 left-0 w-full z-50">
          <BottomNav
            cartItemCount={state.items.reduce(
              (total, item) => total + item.quantity,
              0
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryHierarchyPage;
