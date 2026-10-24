import React from "react";
import { Link, useParams } from "react-router-dom";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";
import StoreCard from "../components/StoreCard";
import { supabase } from "../lib/supabaseClient";
import { getDemoProducts, PARTNER_STORES, toMarketplaceProduct } from "../data/marketplace";
import { rememberReferralAttribution } from "../utils/referrals";
import { setPageMetadata } from "../utils/metadata";

class StoreSharePageBase extends BasePage {
  constructor(props) {
    super(props);
    this.state = { store: null, products: [], loading: true, error: "" };
  }

  componentDidMount() {
    super.componentDidMount();
    const referralCode = new URLSearchParams(window.location.search).get("ref");
    if (referralCode) rememberReferralAttribution(referralCode);
    this.loadStore();
  }

  async loadStore() {
    const { storeId } = this.props;
    const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .select("*")
      .eq("id", storeId)
      .eq("active", true)
      .eq("verified", true)
      .maybeSingle();

    if (storeData) {
      const { data: productRows } = await supabase
        .from("products")
        .select("*, stores(name, location, whatsapp)")
        .eq("store_id", storeId)
        .eq("active", true)
        .order("sort_order");
      const store = {
        ...storeData,
        image: storeData.image_url || "/images/hero-shop.jpg",
        responseTime: storeData.response_time || "Usually replies on WhatsApp",
      };
      const products = (productRows || []).map(toMarketplaceProduct);
      this.setState({ store, products, loading: false });
      setPageMetadata({
        title: `${store.name} | Innovatech Stores`,
        description: `${store.category} in ${store.location}. See verified listings and contact ${store.name} through Innovatech.`,
        image: store.image,
        url: window.location.href,
      });
      return;
    }

    const demoStore = PARTNER_STORES.find((item) => item.id === storeId);
    if (demoStore) {
      const products = getDemoProducts().filter((product) => product.storeId === storeId);
      this.setState({ store: demoStore, products, loading: false });
      setPageMetadata({
        title: `${demoStore.name} | Innovatech Stores`,
        description: `${demoStore.category} in ${demoStore.location}. See verified listings and contact ${demoStore.name} through Innovatech.`,
        image: demoStore.image,
        url: window.location.href,
      });
      return;
    }

    this.setState({ loading: false, error: storeError?.message || "This store is not available." });
  }

  renderPage() {
    const { store, products, loading, error } = this.state;
    if (loading) return <section className="section"><div className="container"><p>Loading store...</p></div></section>;
    if (!store) return <section className="section"><div className="container empty-state"><h2>Store unavailable</h2><p>{error}</p><Link className="btn btn--primary" to="/stores">Browse partner stores</Link></div></section>;

    return (
      <>
        <PageHero image={store.image || "/images/hero-shop.jpg"} eyebrow="Verified partner store" title={store.name} subtitle={`${store.category} · ${store.location}`} />
        <section className="section section--alt">
          <div className="container">
            <div className="share-page-store-header">
              <StoreCard store={store} />
              <div className="share-page-copy">
                <span className="eyebrow">Store catalogue</span>
                <h2>Products from {store.name}.</h2>
                <p>{store.description}</p>
                <p>Use the store contact button for a direct conversation, or ask Innovatech to help verify a product before you buy.</p>
              </div>
            </div>
            <div className="share-page-products">
              <span className="eyebrow">Current listings</span>
              <h2>{products.length ? "Available products" : "No products listed yet"}</h2>
              {products.length ? <div className="grid grid--3">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div> : <p>Ask Innovatech what this store currently has available.</p>}
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default function StoreSharePage() {
  const { id } = useParams();
  return <StoreSharePageBase storeId={id} />;
}
