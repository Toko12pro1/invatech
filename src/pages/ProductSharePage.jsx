import React from "react";
import { Link, useParams } from "react-router-dom";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabaseClient";
import { getDemoProducts, toMarketplaceProduct } from "../data/marketplace";
import { rememberReferralAttribution } from "../utils/referrals";
import { setPageMetadata } from "../utils/metadata";

class ProductSharePageBase extends BasePage {
  constructor(props) {
    super(props);
    this.state = { product: null, loading: true, error: "" };
  }

  componentDidMount() {
    super.componentDidMount();
    const referralCode = new URLSearchParams(window.location.search).get("ref");
    if (referralCode) rememberReferralAttribution(referralCode, this.props.productId);
    this.loadProduct();
  }

  async loadProduct() {
    const { productId } = this.props;
    const { data, error } = await supabase
      .from("products")
      .select("*, stores(name, location, whatsapp)")
      .eq("id", productId)
      .eq("active", true)
      .maybeSingle();

    if (data) {
      const product = toMarketplaceProduct(data);
      this.setState({ product, loading: false });
      setPageMetadata({
        title: `${product.nameEn} | Innovatech Marketplace`,
        description: `${product.condition} ${product.nameEn} listed through ${product.storeName}. Ask Innovatech to confirm availability.`,
        image: product.image,
        url: window.location.href,
      });
      return;
    }

    const demoProduct = getDemoProducts().find((item) => item.id === productId);
    if (demoProduct) {
      this.setState({ product: demoProduct, loading: false });
      setPageMetadata({
        title: `${demoProduct.nameEn} | Innovatech Marketplace`,
        description: `${demoProduct.condition} ${demoProduct.nameEn} listed through ${demoProduct.storeName}. Ask Innovatech to confirm availability.`,
        image: demoProduct.image,
        url: window.location.href,
      });
      return;
    }

    this.setState({ loading: false, error: error?.message || "This product is no longer available." });
  }

  renderPage() {
    const { product, loading, error } = this.state;
    if (loading) return <section className="section"><div className="container"><p>Loading product...</p></div></section>;
    if (!product) return <section className="section"><div className="container empty-state"><h2>Product unavailable</h2><p>{error}</p><Link className="btn btn--primary" to="/shop">Browse the marketplace</Link></div></section>;

    return (
      <>
        <PageHero image={product.image || "/images/hero-shop.jpg"} eyebrow="Innovatech marketplace" title={product.nameEn} subtitle="See the exact listing, store information and safe ways to continue the conversation." />
        <section className="section section--alt">
          <div className="container">
            <div className="grid grid--2 share-page-grid">
              <ProductCard product={product} index={0} highlighted />
              <div className="share-page-copy">
                <span className="eyebrow">Exact listing</span>
                <h2>Share this product with confidence.</h2>
                <p>This page keeps the product, price, store and referral context together when someone arrives from WhatsApp, Facebook or another app.</p>
                <dl className="share-page-facts">
                  <div><dt>Store</dt><dd>{product.storeName}</dd></div>
                  <div><dt>Location</dt><dd>{product.storeLocation}</dd></div>
                  <div><dt>Price</dt><dd>{product.formatPrice()}</dd></div>
                </dl>
                <Link className="btn btn--secondary" to="/shop">Browse more products</Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default function ProductSharePage() {
  const { id } = useParams();
  return <ProductSharePageBase productId={id} />;
}
