// MyStore.tsx
import React, { useEffect, useState } from "react";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type ProductType = {
  _id: string;
  name?: string;
  price?: number;
  category?: string;
  isOffer?: boolean;
  images?: string[];
  image?: string;
  description?: string;
  sizes?: string[];
  colors?: { name: string }[];
};

const MyStore: React.FC = () => {
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("offers");
  const [stats, setStats] = useState({ products: 0, sales: 0, profits: 0 });
  const [deletedId, setDeletedId] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const newProduct: ProductType | undefined = (location.state as any)?.newProduct;
  const updatedProduct: ProductType | undefined = (location.state as any)?.updatedProduct;
  const initialTab = (location.state as any)?.selectedTab || "offers";

  // set initial tab if navigated with one
  useEffect(() => {
    if (initialTab) setSelectedTab(initialTab);
  }, [initialTab]);

  // handle incoming new product (from AddProduct)
  useEffect(() => {
    if (newProduct) {
      setAllProducts((prevAll) => {
        // منع إضافة نفس المنتج مرتين
        const exists = prevAll.find(p => p._id === newProduct._id);
        if (exists) return prevAll;
  
        const updatedAll = [...prevAll, newProduct];
        setProducts(filterByTab(updatedAll, selectedTab));
        setStats(s => ({ ...s, products: updatedAll.length }));
        return updatedAll;
      });
  
      // تنظيف الـ state بعد الإضافة
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [newProduct]);
  

  // handle incoming updated product (from EditProduct)
  useEffect(() => {
    if (updatedProduct) {
      setAllProducts((prevAll) => {
        const updatedAll = prevAll.map((p) =>
          p._id === updatedProduct._id ? { ...p, ...updatedProduct } : p
        );
        setProducts(filterByTab(updatedAll, selectedTab));
        return updatedAll;
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedProduct]);

  // --- handle tab change ---
  useEffect(() => {
    setProducts(filterByTab(allProducts, selectedTab));
  }, [selectedTab, allProducts]);

  function filterByTab(list: ProductType[], tab: string) {
    return tab === "offers"
      ? list.filter((p) => p.isOffer)
      : tab === "women"
      ? list.filter((p) => p.category?.toLowerCase() === "women")
      : tab === "men"
      ? list.filter((p) => p.category?.toLowerCase() === "men")
      : tab === "kids"
      ? list.filter((p) => p.category?.toLowerCase() === "kids")
      : list;
  }

  // --- delete animation ---
  const handleDelete = (e: React.MouseEvent, id: string) => {
    // stop card click navigation
    e.stopPropagation();
    setDeletedId(id);

    setTimeout(() => {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setAllProducts((prev) => prev.filter((p) => p._id !== id));
      setDeletedId(null);
      setStats((prev) => ({ ...prev, products: Math.max(0, prev.products - 1) }));
    }, 300); // مدة الانيمشن 0.3s
  };

  // navigate to edit page
  const goToEdit = (product: ProductType) => {
    navigate(`/edit-product/${product._id}`, { state: { product } });
  };
  

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-10 pb-24">
      {/* Header */}
      <div className="flex items-center mb-5">
        <ChevronLeft
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-bold mx-auto">DASHBOARD</h1>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 overflow-hidden mb-5 border border-black">
        <div className="bg-white py-6 px-4 text-center border-r border-black">
          <p className="text-sm font-medium text-gray-500 mb-1 tracking-wide">
            PRODUCTS
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.products}</p>
          <p className="text-xs text-gray-400">ITEMS</p>
        </div>

        <div className="bg-white py-6 px-4 text-center border-r border-black">
          <p className="text-sm font-medium text-gray-500 mb-1 tracking-wide">
            SALES
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.sales}</p>
          <p className="text-xs text-gray-400">MRU</p>
        </div>

        <div className="bg-white py-6 px-4 text-center">
          <p className="text-sm font-medium text-gray-500 mb-1 tracking-wide">
            PROFITS
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.profits}</p>
          <p className="text-xs text-gray-400">MRU</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-5">
        <button
          onClick={() => navigate("/add-product")}
          className="w-1/2 border border-black py-3 text-sm font-semibold"
        >
          ADD NEW PRODUCT
        </button>
        <button
          onClick={() => navigate("/add-offer")}
          className="w-1/2 border border-black py-3 text-sm font-semibold"
        >
          ADD NEW OFFER
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-10 overflow-x-auto no-scrollbar">
        {["offers", "women", "men", "kids"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-10 py-2 text-sm font-medium ${
              selectedTab === tab ? "bg-black text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-y-12 gap-x-6">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => goToEdit(product)}
            className={`flex flex-col product-card cursor-pointer transition-all duration-300 ${
              deletedId === product._id ? "opacity-0 scale-90" : ""
            }`}
          >
            <div className="bg-gray-100 rounded-xl w-full h-44 mb-4 overflow-hidden">
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700 truncate">
                {product.name || "PRODUCT NAME"}
              </p>
              <button
                onClick={(e) => handleDelete(e, product._id)}
                className="bg-red-600 text-white p-2 rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-sm font-semibold mt-1 text-gray-800">
              {product.price ?? 0} MRU
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyStore;
