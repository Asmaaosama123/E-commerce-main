import React, { useEffect, useState } from "react";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyStore: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("offers");
  const [stats, setStats] = useState({ products: 0, sales: 0, profits: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [selectedTab]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://localhost:7103/api/Owner/products", {
        withCredentials: true,
      });
      const data = res.data || [];

      const filtered =
        selectedTab === "offers"
          ? data.filter((p: any) => p.isOffer)
          : selectedTab === "women"
          ? data.filter((p: any) => p.category?.toLowerCase() === "women")
          : selectedTab === "men"
          ? data.filter((p: any) => p.category?.toLowerCase() === "men")
          : selectedTab === "kids"
          ? data.filter((p: any) => p.category?.toLowerCase() === "kids")
          : data;

      setProducts(filtered);
      setStats({
        products: data.length,
        sales: 115400,
        profits: 105000,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`https://localhost:7103/api/Owner/product/${id}`, {
        withCredentials: true,
      });
      setAllProducts((prev) => prev.filter((p) => p.id !== id)); // تحديث الداتا مباشرة
    } catch (error) {
      console.error("Error deleting product:", error);
      // حتى لو السيرفر مش شغال، نحذفها من الداتا التجريبية
      setAllProducts((prev) => prev.filter((p) => p.id !== id));
    }
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
    <div className="grid grid-cols-3 overflow-hidden mb-5 border border-black ">
  {/* Products */}
  <div className="bg-white py-6 px-4 text-center border-r border-black">
    <p className="text-sm font-medium text-gray-500 mb-1 tracking-wide">
      PRODUCTS
    </p>
    <p className="text-2xl font-bold text-gray-900 mb-1">{stats.products}</p>
    <p className="text-xs text-gray-400">ITEMS</p>
  </div>

  {/* Sales */}
  <div className="bg-white py-6 px-4 text-center border-r border-black">
    <p className="text-sm font-medium text-gray-500 mb-1 tracking-wide">
      SALES
    </p>
    <p className="text-2xl font-bold text-gray-900 mb-1">{stats.sales}</p>
    <p className="text-xs text-gray-400">MRU</p>
  </div>

  {/* Profits */}
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
            className={`px-10 py-4 py-2  text-sm font-medium ${
              selectedTab === tab
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-y-12 gap-x-6">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col">
            <div className="bg-gray-100 rounded-xl w-full h-44 mb-4"></div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700 truncate">
                {product.name || "AESTHETIC CONCRETO FOTO"}
              </p>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-600 text-white p-2 rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-sm font-semibold mt-1 text-gray-800">
              {product.price} MRU
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyStore;
