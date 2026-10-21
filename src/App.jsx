import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
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
import RequireAuth from "./components/admin/RequireAuth";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import SellerWorkspace from "./pages/admin/SellerWorkspace";
import AdminWifiPackages from "./pages/admin/AdminWifiPackages";
import AdminVouchers from "./pages/admin/AdminVouchers";

class PublicLayout extends React.Component {
  render() {
    return (
      <>
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
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/refer" element={<Refer />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/account" element={<Account />} />
            <Route path="/consult" element={<Consultation />} />
            <Route path="/wifi-zone" element={<WifiZone />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="seller" replace />} />
            <Route path="seller" element={<SellerWorkspace />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="wifi-packages" element={<AdminWifiPackages />} />
            <Route path="vouchers" element={<AdminVouchers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}
