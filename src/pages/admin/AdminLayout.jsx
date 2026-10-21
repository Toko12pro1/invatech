import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaBoxOpen, FaWifi, FaTicketAlt, FaSignOutAlt, FaExternalLinkAlt, FaStore, FaClipboardCheck } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import withNavigate from "../../utils/withNavigate";

class AdminLayout extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleLogout() {
    await supabase.auth.signOut();
    this.props.navigate("/admin/login", { replace: true });
  }

  render() {
    return (
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <img src="/images/logo-icon.svg" alt="" width={32} height={32} />
            <span>Innovatech Admin</span>
          </div>
          <nav className="admin-nav">
            <NavLink to="/admin/seller" className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-link--active" : ""}`}>
              <FaStore /> Seller Workspace
            </NavLink>
            <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-link--active" : ""}`}>
              <FaBoxOpen /> Products
            </NavLink>
            <NavLink to="/admin/traceability" className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-link--active" : ""}`}>
              <FaClipboardCheck /> Traceability
            </NavLink>
            <NavLink to="/admin/wifi-packages" className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-link--active" : ""}`}>
              <FaWifi /> WiFi Packages
            </NavLink>
            <NavLink to="/admin/vouchers" className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-link--active" : ""}`}>
              <FaTicketAlt /> Vouchers
            </NavLink>
          </nav>
          <div className="admin-sidebar-footer">
            <a href="/" target="_blank" rel="noreferrer" className="admin-nav-link">
              <FaExternalLinkAlt /> View Site
            </a>
            <button className="admin-nav-link admin-logout" onClick={this.handleLogout}>
              <FaSignOutAlt /> Log Out
            </button>
          </div>
        </aside>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    );
  }
}

export default withNavigate(AdminLayout);
