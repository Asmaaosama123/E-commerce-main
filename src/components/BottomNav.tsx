import React from "react";
import { Home, Store, User, ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

interface BottomNavProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onStoresClick?: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({
  cartItemCount = 0,
  onCartClick,
  onProfileClick,
  onHomeClick,
  onStoresClick,
}) => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath.startsWith(path);

  const handleCartClick = () => {
    onCartClick?.();
    navigate("/cart");
  };

  const handleProfileClick = () => {
    onProfileClick?.();
    navigate("/profile");
  };

  const handleHomeClick = () => {
    onHomeClick?.();
    navigate("/category/women");
  };
  

  const handleStoresClick = () => {
    onStoresClick?.();
    navigate("/stores");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-sm">
      <div
        className={`max-w-[420px] mx-auto flex items-center justify-around py-2 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        {/* Home */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center p-2 transition-colors ${
            isActive("/") ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
          }`}
        >
          <Home className="w-6 h-6" />
        </button>

        {/* Stores */}
        <button
          onClick={handleStoresClick}
          className={`flex flex-col items-center p-2 transition-colors ${
            isActive("/stores") ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
          }`}
        >
          <Store className="w-6 h-6" />
        </button>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          className={`flex flex-col items-center p-2 transition-colors ${
            isActive("/profile") ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
          }`}
        >
          <User className="w-6 h-6" />
        </button>

        {/* Cart */}
        <button
          onClick={handleCartClick}
          className={`flex flex-col items-center p-2 relative transition-colors ${
            isActive("/cart") ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
          }`}
        >
          <ShoppingCart className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span
              className={`absolute -top-1 ${
                isRTL ? "-left-1" : "-right-1"
              } bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md`}
            >
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
