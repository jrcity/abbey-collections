import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '@/components/layouts/Navbar';
import ShopPage from '@/shop/ShopPage';
import AdminUpload from '@/pages/admin/AdminUploadPage';
import CartPage from '@/pages/CartPage';
import { CartProvider } from '@/context/CartContext';
import { UIProvider } from '@/context/UIContext';
import { AnimatePresence, motion } from 'framer-motion';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <ShopPage />
            </PageWrapper>
          }
        />
        <Route
          path="/cart"
          element={
            <PageWrapper>
              <CartPage />
            </PageWrapper>
          }
        />
        <Route
          path="/abbey-admin-access-portal-2024"
          element={
            <PageWrapper>
              <AdminUpload />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <CartProvider>
      <UIProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <AnimatedRoutes />
            </main>

            <footer className="bg-white py-12 text-center text-gray-400 text-sm border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4">
                <p className="font-bold text-gray-900 mb-2">Abbey Collections & Designs</p>
                <p>© {new Date().getFullYear()} All Rights Reserved. Built with 🩷 by Nexalith.</p>
              </div>
            </footer>
          </div>
        </Router>
      </UIProvider>
    </CartProvider>
  );
}

export default App;