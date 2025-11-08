// src/pages/CheckoutPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import BottomNav from "../components/BottomNav";

export interface OrderData {
  shippingAddress: {
    address: string;
    city: string;
  };
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, getCartTotal, dispatch } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    promo: "",
  });

  const subtotal = getCartTotal();
  const deliveryFee = 100;
  const total = subtotal + deliveryFee;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    if (!formData.fullName || !formData.address || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    if (state.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderData: OrderData = {
      shippingAddress: {
        address: formData.address,
        city: formData.city,
      },
    };

    console.log("Order placed:", orderData);
    dispatch({ type: "CLEAR_CART" });
    alert("Order placed successfully!");
    navigate("/category/women");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-3 py-2 bg-white shadow-sm">
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

        <h1 className="text-sm font-bold text-gray-900">PAYMENT</h1>
        <div className="w-6" />
      </header>

      {/* Main Content */}
      <div className="flex-1 px-3 py-2 space-y-2 text-xs">
        {/* Address Section */}
        <section className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">ADDRESS</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="NAME"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 p-1.5 rounded-md focus:ring-1 focus:ring-yellow-400 outline-none text-xs"
            />
            <input
              type="text"
              placeholder="ADDRESS"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 p-1.5 rounded-md focus:ring-1 focus:ring-yellow-400 outline-none text-xs"
            />
            <input
              type="tel"
              placeholder="PHONE"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 p-1.5 rounded-md focus:ring-1 focus:ring-yellow-400 outline-none text-xs"
            />
          </div>
        </section>

        {/* Payment Method */}
        <section className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">
            PAYMENT METHOD
          </h2>
          <div className="flex items-center justify-between border border-gray-300 rounded-md p-2 cursor-pointer hover:border-yellow-400 transition text-xs">
            <span className="font-semibold text-gray-900">CASH ON DELIVERY</span>
            <span className="w-3.5 h-3.5 rounded-sm bg-yellow-400 border border-yellow-500"></span>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm space-y-1 text-xs">
          <div className="flex justify-between font-semibold text-gray-900">
            <span>SUBTOTAL:</span>
            <span>{subtotal} MRU</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900">
            <span>DELIVERY:</span>
            <span>{deliveryFee} MRU</span>
          </div>
          <div className="flex justify-between font-bold text-green-600 text-sm">
            <span>TOTAL:</span>
            <span>{total} MRU</span>
          </div>

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="CODE PROMO"
              value={formData.promo}
              onChange={(e) => handleInputChange("promo", e.target.value)}
              className="flex-1 bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 p-1.5 rounded-md focus:ring-1 focus:ring-yellow-400 outline-none text-xs"
            />
            <button className="px-3 py-1.5 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition text-xs">
              APPLY
            </button>
          </div>
        </section>
      </div>

      {/* Confirm Button + BottomNav */}
      <div className="relative">
        <div className="px-3 py-2 bg-gray-50">
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-yellow-400 text-black font-bold text-xs py-2 rounded-lg hover:bg-yellow-500 transition-all mb-14"
          >
            CONFIRM
          </button>
        </div>

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

export default CheckoutPage;
