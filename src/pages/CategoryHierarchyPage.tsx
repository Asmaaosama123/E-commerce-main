// src/pages/CategoryHierarchyPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categoryData } from "../data/categoryData";
import { ArrowRight } from "lucide-react";
import HeroSection from "../components/HeroSection";
import CategoryNav from "../components/CategoryNav";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import productsOnOffer from "../data/offersData";
import { useCart } from "../contexts/CartContext";

const CategoryHierarchyPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  // initial key من الـ URL أو 'woman' كافتراضي
  const initialKey = (categoryName || "woman").toLowerCase();
  const [activeCategory, setActiveCategory] = useState(initialKey);

  // لما يتغير param في الـ URL، نحدّث activeCategory
  useEffect(() => {
    const next = (categoryName || "woman").toLowerCase();
    setActiveCategory(next);
  }, [categoryName]);

  // نستخدم activeCategory لاختيار البيانات
  const data = categoryData[activeCategory] || categoryData["woman"];
  const { state, getCartTotal, dispatch } = useCart();

  // ✅ الفلترة عشان نعرض بس المنتجات اللي عليها خصم
  const productsOnOffer = data.bestSellers.filter(
    (p) => p.originalPrice && p.originalPrice > p.price
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      {/* المحتوى الرئيسي */}
      <div className="w-full max-w-7xl bg-white min-h-screen">
        {/* Header */}
        <Header
          cartItemCount={0}
          onCartClick={() => navigate("/cart")}
          onLogoClick={() =>
            navigate(`/category/${encodeURIComponent(activeCategory)}`)
          }
        />

        {/* CategoryNav مع تمرير الـ active category */}
        <CategoryNav selectedCategory={activeCategory} />

        {/* Hero Section */}
        <div className="mt-3 px-4 md:px-8">
          <HeroSection category={data} />
        </div>

        {/* Collections */}
        <main className="mt-5 px-4 md:px-8 pb-24">
          <section>
            <h2 className="text-sm md:text-base font-semibold mb-3">
              Collections
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {data.subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="cursor-pointer flex flex-col items-center"
                  onClick={() =>
                    navigate(`/category/${activeCategory}/${sub.id}`)
                  }
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs md:text-sm text-center mt-2 truncate">
                    {sub.name}
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
              {data.stores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => navigate(`/store/${store.id}`)}
                  className="bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md p-3 text-center text-sm md:text-base font-medium text-gray-700"
                >
                  {store.name}
                </div>
              ))}
            </div>
          </section>

          {/* ✅ Products on Offer (بدل Recommended) */}
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
              {productsOnOffer.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="bg-white shadow-sm overflow-hidden cursor-pointer hover:shadow-md"
                >
                  <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    {/* ✅ شارة الخصم */}
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  <div className="p-2 text-center">
                    <p className="text-sm md:text-base font-medium truncate w-full">
                      {p.name}
                    </p>

                    <div className="flex justify-center items-baseline mt-1 space-x-2">
                      <span className="text-xs md:text-sm text-gray-400 line-through">
                        MRU {p.originalPrice?.toFixed(2)}
                      </span>
                      <span className="text-sm md:text-base font-semibold text-gray-900">
                        MRU {p.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* BottomNav */}
        <div className="fixed bottom-0 left-0 w-full z-50">
        <BottomNav
            cartItemCount={state.items.reduce(
              (total, item) => total + item.quantity,
              0
            )}
          />        </div>
      </div>
    </div>
  );
};

export default CategoryHierarchyPage;
