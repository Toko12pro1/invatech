import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBolt, FaBoxOpen, FaCheckCircle, FaClipboardCheck, FaReceipt, FaStore } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";

const EMPTY_STATS = {
  products: 0,
  pendingListings: 0,
  activeFastDeals: 0,
  endedFastDeals: 0,
  stores: 0,
  pendingProofs: 0,
};

export default class AdminOverview extends React.Component {
  state = { stats: EMPTY_STATS, loading: true, error: "" };

  componentDidMount() {
    this.loadStats();
  }

  async loadStats() {
    this.setState({ loading: true, error: "" });
    await supabase.rpc("deactivate_expired_fast_deals");
    const [{ data: products, error: productsError }, { data: stores, error: storesError }, { data: proofs, error: proofsError }] = await Promise.all([
      supabase.from("products").select("id, listing_status, fast_deal, fast_deal_expired_at"),
      supabase.from("stores").select("id, active, verified"),
      supabase.from("purchase_proofs").select("id, status, reward_status"),
    ]);

    const error = productsError || storesError || proofsError;
    if (error) {
      this.setState({ loading: false, error: error.message });
      return;
    }

    this.setState({
      loading: false,
      stats: {
        products: products?.length || 0,
        pendingListings: (products || []).filter((product) => product.listing_status === "pending").length,
        activeFastDeals: (products || []).filter((product) => product.fast_deal).length,
        endedFastDeals: (products || []).filter((product) => product.fast_deal_expired_at).length,
        stores: (stores || []).filter((store) => store.active && store.verified).length,
        pendingProofs: (proofs || []).filter((proof) => proof.status === "pending" || proof.reward_status === "pending").length,
      },
    });
  }

  render() {
    const { stats, loading, error } = this.state;
    const cards = [
      { label: "All listings", value: stats.products, hint: "Every product in the catalog", icon: <FaBoxOpen />, to: "/admin/products" },
      { label: "Needs review", value: stats.pendingListings, hint: "Seller listings waiting for you", icon: <FaClipboardCheck />, to: "/admin/seller" },
      { label: "Live Fast Deals", value: stats.activeFastDeals, hint: "Currently visible on the site", icon: <FaBolt />, to: "/admin/products" },
      { label: "Ended Fast Deals", value: stats.endedFastDeals, hint: "History kept for accountability", icon: <FaCheckCircle />, to: "/admin/products" },
      { label: "Partner stores", value: stats.stores, hint: "Active and verified stores", icon: <FaStore />, to: "/admin/stores" },
      { label: "Proofs to review", value: stats.pendingProofs, hint: "Receipts and Mobile Money", icon: <FaReceipt />, to: "/admin/purchase-proofs" },
    ];

    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <span className="eyebrow">Operations centre</span>
            <h1>Innovatech control room</h1>
            <p className="admin-page-hint">Review listings, keep partner stores accurate and follow every customer purchase record from one place.</p>
          </div>
          <button className="btn btn--ghost" type="button" onClick={() => this.loadStats()}>Refresh</button>
        </div>

        {error && <p className="form-error">{error}</p>}
        {loading ? <p>Loading dashboard...</p> : (
          <>
            <div className="admin-overview-grid">
              {cards.map((card) => (
                <Link className="admin-overview-card" to={card.to} key={card.label}>
                  <span className="admin-overview-icon">{card.icon}</span>
                  <span className="admin-overview-label">{card.label}</span>
                  <strong>{card.value}</strong>
                  <small>{card.hint}</small>
                  <FaArrowRight className="admin-overview-arrow" aria-hidden="true" />
                </Link>
              ))}
            </div>

            <section className="admin-overview-actions">
              <div>
                <span className="eyebrow">Daily workflow</span>
                <h2>Keep the marketplace honest and current.</h2>
                <p>Fast Deals expire automatically at their end time. Ended listings stay in the admin history, while customers only see active deals.</p>
              </div>
              <div className="admin-overview-action-links">
                <Link to="/admin/seller" className="btn btn--primary"><FaBoxOpen /> Review seller listings</Link>
                <Link to="/admin/stores" className="btn btn--ghost"><FaStore /> Manage stores</Link>
              </div>
            </section>
          </>
        )}
      </div>
    );
  }
}
