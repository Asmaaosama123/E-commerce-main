// src/pages/SubcategoryHierarchyPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { useCart } from "../contexts/CartContext";
import FilterModal from "../components/FilterModal";

const categoryData = {
  woman: {
    subcategories: [
      {
        name: "Dresses",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop",
        products: [
          { id: "1", name: "Elegant Floral Dress", price: 89.99, store: "Zara", caseType: "New", shippedIn: "One Week", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop" },
          { id: "2", name: "Casual Summer Dress", price: 79.99, store: "H&M", caseType: "Used", shippedIn: "One Day", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=600&fit=crop" },
        ],
      },
      {
        name: "Tops",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
        products: [
          { id: "3", name: "White Crop Top", price: 59.99, store: "Bershka", caseType: "New", shippedIn: "Three Weeks", image: "https://images.unsplash.com/photo-1520975918311-95d4a27b8d6f?w=600&h=600&fit=crop" },
        ],
      },
    ],
  },
};

const SubcategoryHierarchyPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName?: string }>();
  const navigate = useNavigate();
  const { state } = useCart();

  const categoryKey = (categoryName || "woman").toLowerCase();
  const category = categoryData[categoryKey];

  const [selectedSubcategory, setSelectedSubcategory] = useState(category?.subcategories[0]?.name || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [selectedShipped, setSelectedShipped] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const currentSub = category?.subcategories.find((s) => s.name === selectedSubcategory);
  const [filteredProducts, setFilteredProducts] = useState(currentSub?.products || []);

  const storeOptions = [...new Set(currentSub?.products.map((p) => p.store))];
  const caseOptions = [...new Set(currentSub?.products.map((p) => p.caseType))];
  const shippedOptions = [...new Set(currentSub?.products.map((p) => p.shippedIn))];

  // تحديث المنتجات عند تغيير السوبكاتيجوري
  useEffect(() => {
    setFilteredProducts(currentSub?.products || []);
    setSelectedStores([]);
    setSelectedCases([]);
    setSelectedShipped([]);
    setPriceRange([0, 1000]);
  }, [selectedSubcategory]);

  // دالة Apply للفلاتر
  const applyFilters = () => {
    let temp = currentSub?.products || [];

    if (selectedStores.length > 0) temp = temp.filter(p => selectedStores.includes(p.store));
    if (selectedCases.length > 0) temp = temp.filter(p => selectedCases.includes(p.caseType));
    if (selectedShipped.length > 0) temp = temp.filter(p => selectedShipped.includes(p.shippedIn));
    temp = temp.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setFilteredProducts(temp);
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setSelectedStores([]);
    setSelectedCases([]);
    setSelectedShipped([]);
    setPriceRange([0, 1000]);
    setFilteredProducts(currentSub?.products || []);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white z-50 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base font-semibold uppercase tracking-wide">{categoryName || "Collection"}</h1>
          <div className="w-6 h-6" />
        </div>

        {/* Subcategories Slider */}
        <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide bg-white">
          {category?.subcategories.map((sub) => (
            <div key={sub.name} onClick={() => setSelectedSubcategory(sub.name)} className="flex flex-col items-center cursor-pointer min-w-[80px]">
              <div className={`w-16 h-16 rounded-md overflow-hidden border-2 ${selectedSubcategory === sub.name ? "border-black" : "border-gray-200"}`}>
                <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
              </div>
              <p className={`text-[11px] mt-1 text-center truncate w-16 ${selectedSubcategory === sub.name ? "text-black font-semibold" : "text-gray-600"}`}>{sub.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filter Button */}
      <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-100">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setFilterOpen(true)}
          className="ml-3 flex items-center gap-1 px-3 py-2 bg-gray-900 text-white rounded-full shadow-sm hover:bg-gray-800 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Filter</span>
        </button>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={applyFilters}
        onReset={resetFilters}
        stores={storeOptions || []}
        cases={caseOptions || []}
        shippedOptions={shippedOptions || []}
        selectedStores={selectedStores}
        selectedCases={selectedCases}
        selectedShipped={selectedShipped}
        priceRange={priceRange}
        onFilterChange={(field, value) => {
          if (field === "store") {
            setSelectedStores(prev => prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]);
          } else if (field === "case") {
            setSelectedCases(prev => prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]);
          } else if (field === "shipped") {
            setSelectedShipped(prev => prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]);
          } else if (field === "price") {
            setPriceRange(value);
          }
        }}
      />

      {/* Products */}
      <div className="px-4 py-5 grid grid-cols-2 gap-4">
        {filteredProducts.map((p) => (
          <div key={p.id} className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigate(`/product/${p.id}`)}
          >
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-xl">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-sm font-medium mt-2">{p.name}</p>
            <p className="text-sm font-semibold">{p.price} MRU</p>
          </div>
        ))}
      </div>

      <BottomNav cartItemCount={state.items.reduce((total, item) => total + item.quantity, 0)} />
    </div>
  );
};

export default SubcategoryHierarchyPage;
