import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './contexts/CartContext';
import { useAuth } from './contexts/AuthContext';

import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import HeroSection from './components/HeroSection';
import { ProductSection } from './components/ProductSection';
import Cart from './components/Cart';
import BottomNav from './components/BottomNav';

import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';
import MyStore from './components/MyStore';
import CheckoutPage, { OrderData as CheckoutOrderData } from './components/CheckoutPage';
import SuccessPage from './components/SuccessPage';

import BestSellersPage from './pages/BestSellersPage';
import StoresPage from './pages/StoresPage';
import OffersPage from './pages/OffersPage';
import AddProduct from './pages/AddProduct';
import AddOffer from './pages/AddOffer';
import StorePage from './pages/StoreDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CategoryHierarchyPage from './pages/CategoryHierarchyPage';
import SubcategoryHierarchyPage from './pages/SubcategoryHierarchyPage';

import { categories, mockProducts } from './data/products';
import { Product } from './types';
import { useFavorites } from './hooks/useFavorites';

function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { isFavorite, toggleFavorite, isLoading: favoritesLoading } = useFavorites();
  const navigate = useNavigate();

  // 🧩 تحميل بيانات المنتجات التجريبية
  useEffect(() => {
    setProductsLoading(true);
    setTimeout(() => {
      setAllProducts(mockProducts);
      setProductsLoading(false);
    }, 600);
  }, []);

  // دوال مؤقتة للسلة (مش متصلة بباك إند)
  const cartItems: Product[] = [];
  const addToCart = () => {};
  const removeFromCart = () => {};
  const updateQuantity = () => {};
  const getCartItemCount = () => 0;
  const getCartTotal = () => 0;
  const isInCart = () => false;
  const clearCart = () => {};
  const cartLoading = false;

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Header
        cartItemCount={getCartItemCount()}
        onCartClick={() => setIsCartOpen(true)}
        onLogoClick={() => navigate('/')}
      />

      <CategoryNav
        categories={categories}
        selectedCategory="all"
        onCategorySelect={(slug) => navigate(`/category/${slug}`)}
      />

      <main className="bg-white">
        <HeroSection onShopNowClick={() => navigate('/best-sellers')} />

       
      </main>
{/* 
      <BottomNav
        cartItemCount={getCartItemCount()}
        onCartClick={() => setIsCartOpen(true)}
        onProfileClick={() => navigate('/profile')}
        onHomeClick={() => navigate('/')}
        onMenuClick={() => navigate('/stores')}
      /> */}

      {/* <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => navigate('/checkout')}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        total={getCartTotal()}
      /> */}
    </div>
  );
}

function App() {
  const { user, loading: authLoading, logout } = useAuth();

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );

  if (!user) return <LoginPage />;

  return (
    <CartProvider>
      <Toaster position="top-right" />

      <Routes>
        {/* الصفحة الرئيسية */}
        <Route path="/" element={<Navigate to="/category/women" replace />} />

        {/* الكاتيجوريات */}
        <Route path="/category/:categoryName" element={<CategoryHierarchyPage />} />
        <Route path="/category/:categoryName/:subcategoryName" element={<SubcategoryHierarchyPage />} />
        <Route path="/offers/:categoryName" element={<OffersPage />} />
        <Route path="/OffersPage" element={<OffersPage />} />

        {/* الصفحات */}
        <Route path="/best-sellers" element={<BestSellersPage />} />
        <Route path="/stores/:categoryName?" element={<StoresPage />} />
        <Route path="/store/:storeId" element={<StorePage />} />
        {/* <Route path="/storeDetailPage/:storeName" element={<StoresPage />} /> */}
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage onBack={() => {}} subtotal={0} onConfirmOrder={() => {}} />} />
        <Route path="/success" element={<SuccessPage onGoHome={() => {}} />} />

        {/* الصفحات الشخصية */}
        <Route path="/profile" element={<UserProfile user={user} logout={logout} onOpenMyStore={() => {}} />} />
        <Route path="/my-store" element={<MyStore onBack={() => {}} onViewSellerPage={() => {}} />} />
        <Route path="/add-product" element={<AddProduct />} />
<Route path="/add-offer" element={<AddOffer />} />
        {/* الصفحة الرئيسية العامة */}
        <Route path="/*" element={<LoginPage />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
