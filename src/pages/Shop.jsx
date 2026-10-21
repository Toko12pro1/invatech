import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { FaArrowRight, FaBolt, FaCheckCircle, FaShieldAlt, FaStore, FaWhatsapp } from "react-icons/fa";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabaseClient";
import { getDemoProducts, PARTNER_STORES, toMarketplaceProduct, whatsappLink } from "../data/marketplace";

const CATEGORIES = ["All", "Fast Deals", "Smartphones", "Wearables", "Audio", "Cameras", "Gaming"];

class Shop extends BasePage {
  constructor(props) {
    super(props);
    this.state = { activeCategory: "All", products: [], loading: true };
    this.setCategory = this.setCategory.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.loadProducts();
  }

  async loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*, stores(name, location)")
      .eq("active", true)
      .order("sort_order");
    if (error || !data?.length) {
      this.setState({ products: getDemoProducts(), loading: false });
      return;
    }
    this.setState({ products: data.map(toMarketplaceProduct), loading: false });
  }

  setCategory(category) {
    this.setState({ activeCategory: category });
  }

  getFilteredProducts() {
    const { activeCategory, products } = this.state;
    if (activeCategory === "All") return products;
    if (activeCategory === "Fast Deals") return products.filter((product) => product.isFastDealActive);
    return products.filter((product) => product.category === activeCategory);
  }

  renderPage() {
    const filtered = this.getFilteredProducts();
    const { t } = this.props;
    const { loading } = this.state;

    return (
      <>
        <PageHero
          image="/images/hero-shop.jpg"
          eyebrow={t("shop.hero.eyebrow")}
          title={t("shop.hero.title")}
          subtitle={t("shop.hero.subtitle")}
        />

        <section className="section">
          <div className="container">
            <SectionHeading eyebrow={t("shop.browse.eyebrow")} title={t("shop.browse.title")} />

            <Reveal className="marketplace-trust-panel">
              <div className="marketplace-trust-copy">
                <span className="eyebrow">A safer way to buy</span>
                <h2>Shop from stores we know, with a team that checks first.</h2>
                <p>
                  We connect you to trusted local stores. Before you buy through Innovatech, we
                  confirm the product, test it where possible, and help you chat with the seller.
                </p>
                <div className="marketplace-trust-actions">
                  <Link to="/stores" className="btn btn--secondary">
                    Meet our partner stores <FaArrowRight aria-hidden="true" />
                  </Link>
                  <Link to="/consult" className="btn btn--outline-light">
                    Ask us to check first <FaShieldAlt aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="marketplace-trust-list">
                <div><FaShieldAlt /><span><strong>Verified listing</strong>We confirm the product and seller.</span></div>
                <div><FaCheckCircle /><span><strong>Tested before handover</strong>We help you buy with confidence.</span></div>
                <div><FaWhatsapp /><span><strong>Real human support</strong>Ask questions on WhatsApp.</span></div>
              </div>
            </Reveal>

            <Reveal className="fast-deal-banner">
              <div className="fast-deal-banner-icon"><FaBolt /></div>
              <div><strong>Fast Deals</strong><span>Some sellers need quick cash, so they list below-market prices. We help verify the item and negotiate fairly.</span></div>
              <button className="btn btn--dark" onClick={() => this.setCategory("Fast Deals")}>See Fast Deals <FaArrowRight /></button>
            </Reveal>

            <Reveal className="shop-filters">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`filter-pill ${this.state.activeCategory === category ? "filter-pill--active" : ""}`}
                  onClick={() => this.setCategory(category)}
                >
                  {category === "Fast Deals" ? <><FaBolt aria-hidden="true" /> {category}</> : t(`shop.categories.${category}`)}
                </button>
              ))}
            </Reveal>

            {loading ? (
              <p>Loading…</p>
            ) : filtered.length ? (
              <div className="grid grid--3">
                {filtered.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FaStore aria-hidden="true" />
                <h3>No products in this category yet</h3>
                <p>Tell us what you are looking for and we will search our partner stores for you.</p>
                <a className="btn btn--primary" href={whatsappLink("Hi Innovatech, I'm looking for a product that is not currently listed.")} target="_blank" rel="noreferrer">
                  Ask on WhatsApp <FaWhatsapp aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="section section--alt marketplace-stores-preview">
          <div className="container">
            <SectionHeading
              eyebrow="Our network"
              title="The stores behind the listings"
              subtitle="You are not buying from an anonymous page. You can see who you are buying from and chat with them directly."
            />
            <div className="grid grid--3">
              {PARTNER_STORES.map((store) => (
                <article className="store-mini-card" key={store.id}>
                  <img src={store.image} alt="" />
                  <div>
                    <span className="store-verified"><FaShieldAlt /> Verified partner</span>
                    <h3>{store.name}</h3>
                    <p>{store.category} · {store.location}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-banner">
          <div className="container cta-banner-inner">
            <Reveal>
              <h2>{t("shop.cta.title")}</h2>
              <p>{t("shop.cta.subtitle")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <a
                href={whatsappLink("Hi Innovatech, I would like help choosing a verified product.")}
                target="_blank"
                rel="noreferrer"
                className="btn btn--dark"
              >
                <FaWhatsapp aria-hidden="true" /> {t("common.chatWithUs")}
              </a>
            </Reveal>
          </div>
        </section>
      </>
    );
  }
}

export default withTranslation()(Shop);
