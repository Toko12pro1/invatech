import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Shop from "./pages/Shop";
import Stores from "./pages/Stores";
import Refer from "./pages/Refer";
import Portfolio from "./pages/Portfolio";
import Account from "./pages/Account";
import Consultation from "./pages/Consultation";
import WifiZone from "./pages/WifiZone";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import RequireAdmin from "./components/admin/RequireAdmin";
import RequireSellerAccess from "./components/admin/RequireSellerAccess";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import SellerWorkspace from "./pages/admin/SellerWorkspace";
import AdminWifiPackages from "./pages/admin/AdminWifiPackages";
import AdminVouchers from "./pages/admin/AdminVouchers";
import AdminTraceability from "./pages/admin/AdminTraceability";
import AdminPurchaseProofs from "./pages/admin/AdminPurchaseProofs";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminStores from "./pages/admin/AdminStores";
import AdminStoreOwnerApplications from "./pages/admin/AdminStoreOwnerApplications";
import MetaPixelTracker from "./components/MetaPixelTracker";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

class PublicLayout extends React.Component {
  render() {
    return (
      <>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Navbar />
        <Outlet />
        <Footer />
      </>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <MetaPixelTracker />
          <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/fast-deals" element={<Shop initialCategory="Fast Deals" />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/refer" element={<Refer />} />
            <Route path="/achievements" element={<Portfolio />} />
            <Route path="/portfolio" element={<Navigate to="/achievements" replace />} />
            <Route path="/account" element={<Account />} />
            <Route path="/consult" element={<Consultation />} />
            <Route path="/wifi-zone" element={<WifiZone />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/seller"
            element={
              <RequireSellerAccess>
                <AdminLayout />
              </RequireSellerAccess>
            }
          >
            <Route index element={<SellerWorkspace />} />
          </Route>
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="stores" element={<AdminStores />} />
            <Route path="store-owner-applications" element={<AdminStoreOwnerApplications />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="traceability" element={<AdminTraceability />} />
            <Route path="purchase-proofs" element={<AdminPurchaseProofs />} />
            <Route path="wifi-packages" element={<AdminWifiPackages />} />
            <Route path="vouchers" element={<AdminVouchers />} />
          </Route>
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    );
  }
}
