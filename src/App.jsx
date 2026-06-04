import React, { useEffect, lazy, Suspense } from "react";
import "./assets/styles/global.css";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import FloatingMenu from "./components/FloatingMenu";
import Home from "./pages/home/Home";
import Footer from "./components/Footer";
import ToastNotification from "./modals/ToastNotification";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load components for better performance
const ProductDetail = lazy(() => import("./pages/product-detail/ProductDetail"));
const ProductPage = lazy(() => import("./pages/products/ProductPage"));
const CartPage = lazy(() => import("./pages/cart/CartPage"));
const CheckoutPage = lazy(() => import("./pages/checkout/CheckoutPage"));
const AboutPage = lazy(() => import("./pages/about-us/AboutPage"));
const BecomeaSeller = lazy(() => import("./pages/become-a-seller/BecomeaSeller"));
const BlogPage = lazy(() => import("./pages/blog/BlogPage"));
const ContactPage = lazy(() => import("./pages/contact/ContactPage"));
const BlogDetail = lazy(() => import("./pages/blog-details/BlogDetail"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));

// Loading component for lazy loaded routes
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E5B236]"></div>
  </div>
);

const App = () => {
  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [pathname]);

    return null;
  };

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          /> */}

          <Route path="about-us" element={<AboutPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/become-a-seller" element={<BecomeaSeller />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/contact-us" element={<ContactPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <FloatingMenu />
      <ToastNotification />
    </>
  );
};

export default App;
