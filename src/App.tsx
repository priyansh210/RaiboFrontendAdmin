import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Index from './pages/Index';

// Auth Pages
import SellerLogin from './pages/seller/SellerLogin';
import SellerRegister from './pages/seller/SellerRegister';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerProductForm from './pages/seller/SellerProductForm';
import SellerProductPreview from './pages/seller/SellerProductPreview';
import Shops from './pages/seller/company/Shops';
import InventoryForecast from './pages/seller/inventory/Forecast';
import Payments from './pages/seller/Payments';
import Orders from './pages/seller/Orders';
import Logistics from './pages/seller/Logistics';
import Reviews from './pages/seller/Reviews';
import KYCPage from './pages/seller/company/KYC';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductPreview from './pages/admin/AdminProductPreview';

import './App.css';

const queryClient = new QueryClient();

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <div className="min-h-screen flex flex-col">
              <Routes>
                {/* Landing Page */}
                <Route path="/" element={<Index />} />

                {/* Seller Auth & Dashboard */}
                <Route path="/seller/login" element={<SellerLogin />} />
                <Route path="/seller/register" element={<SellerRegister />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/products" element={<SellerProducts />} />
                <Route path="/seller/products/add" element={<SellerProductForm />} />
                <Route path="/seller/products/edit/:productId" element={<SellerProductForm />} />
                <Route path="/seller/products/preview/:productId" element={<SellerProductPreview />} />

                {/* Seller Sidebar Dummy Routes */}
                <Route path="/seller/company/shops" element={<Shops />} />
                <Route path="/seller/company/kyc" element={<KYCPage />} />
                <Route path="/seller/inventory/forecast" element={<InventoryForecast />} />
                <Route path="/seller/payments" element={<Payments />} />
                <Route path="/seller/orders" element={<Orders />} />
                <Route path="/seller/logistics" element={<Logistics />} />
                <Route path="/seller/reviews" element={<Reviews />} />

                {/* Admin Auth & Dashboard */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products/preview/:productId" element={<AdminProductPreview />} />

                {/* 404 */}
                <Route path="*" element={<Index />} />
              </Routes>
            </div>
            <Toaster />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
