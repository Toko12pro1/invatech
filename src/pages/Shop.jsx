import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import {
  FaArrowRight,
  FaBolt,
  FaCheckCircle,
  FaClipboardCheck,
  FaSearch,
  FaShieldAlt,
  FaStore,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";
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
    this.state = {
      activeCategory: "All",
      products: [],
      loading: true,
      search: "",
      store: "All",
      location: "All",
      minPrice: "",
      maxPrice: "",
      sortBy: "featured",
    };
    this.setCategory = this.setCategory.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
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

  setFilter(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  resetFilters() {
    this.setState({
      activeCategory: "All",
      search: "",
      store: "All",
      location: "All",
      minPrice: "",
      maxPrice: "",
      sortBy: "featured",
    });
  }

  getFilterOptions(field) {
    return [...new Set(this.state.products.map((product) => product[field]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  getFilteredProducts() {
    const { activeCategory, products, search, store, location, minPrice, maxPrice, sortBy } = this.state;
    const searchTerm = search.trim().toLowerCase();
    const minimum = minPrice === "" ? null : Number(minPrice);
    const maximum = maxPrice === "" ? null : Number(maxPrice);

    const filtered = products.filter((product) => {
      const searchableText = [
        product.nameEn,
        product.nameFr,
        product.category,
        product.storeName,
        product.storeLocation,
      ].filter(Boolean).join(" ").toLowerCase();
      const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
      const matchesCategory = activeCategory === "All"
        || (activeCategory === "Fast Deals" ? product.isFastDealActive : product.category === activeCategory);
      const matchesStore = store === "All" || product.storeName === store;
      const matchesLocation = location === "All" || product.storeLocation === location;
      const matchesMinimum = minimum === null || product.price >= minimum;
      const matchesMaximum = maximum === null || product.price <= maximum;

      return matchesSearch && matchesCategory && matchesStore && matchesLocation && matchesMinimum && matchesMaximum;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.getName("en").localeCompare(b.getName("en"));
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });
  }

  renderPage() {
    const filtered = this.getFilteredProducts();
    const { t } = this.props;
    const { loading, search, store, location, minPrice, maxPrice, sortBy } = this.state;
    const stores = this.getFilterOptions("storeName");
    const locations = this.getFilterOptions("storeLocation");

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

            <Reveal className="shop-filter-panel">
              <div className="shop-search-row">
                <label className="shop-search-field" htmlFor="shop-search">
                  <FaSearch aria-hidden="true" />
                  <input
                    id="shop-search"
                    name="search"
                    value={search}
                    onChange={this.setFilter}
                    placeholder={t("shop.filters.searchPlaceholder")}
                  />
                </label>
                <button type="button" className="shop-clear-filters" onClick={this.resetFilters}>
                  <FaTimes aria-hidden="true" /> {t("shop.filters.clear")}
                </button>
              </div>

              <div className="shop-filter-grid">
                <label className="shop-filter-control">
                  <span>{t("shop.filters.store")}</span>
                  <select name="store" value={store} onChange={this.setFilter}>
                    <option value="All">{t("shop.filters.allStores")}</option>
                    {stores.map((storeName) => <option key={storeName} value={storeName}>{storeName}</option>)}
                  </select>
                </label>
                <label className="shop-filter-control">
                  <span>{t("shop.filters.location")}</span>
                  <select name="location" value={location} onChange={this.setFilter}>
                    <option value="All">{t("shop.filters.allLocations")}</option>
                    {locations.map((storeLocation) => <option key={storeLocation} value={storeLocation}>{storeLocation}</option>)}
                  </select>
                </label>
                <label className="shop-filter-control">
                  <span>{t("shop.filters.minPrice")}</span>
                  <input name="minPrice" type="number" min="0" value={minPrice} onChange={this.setFilter} placeholder="0" />
                </label>
                <label className="shop-filter-control">
                  <span>{t("shop.filters.maxPrice")}</span>
                  <input name="maxPrice" type="number" min="0" value={maxPrice} onChange={this.setFilter} placeholder="No limit" />
                </label>
                <label className="shop-filter-control">
                  <span>{t("shop.filters.sort")}</span>
                  <select name="sortBy" value={sortBy} onChange={this.setFilter}>
                    <option value="featured">{t("shop.filters.featured")}</option>
                    <option value="price-low">{t("shop.filters.priceLow")}</option>
                    <option value="price-high">{t("shop.filters.priceHigh")}</option>
                    <option value="name">{t("shop.filters.name")}</option>
                  </select>
                </label>
              </div>
              <p className="shop-filter-summary">
                <strong>{filtered.length}</strong> {filtered.length === 1 ? t("shop.filters.result") : t("shop.filters.results")} · {t("shop.filters.hint")}
              </p>
            </Reveal>

            <Reveal className="shop-help-panel">
              <div className="shop-help-copy">
                <span className="shop-help-icon"><FaClipboardCheck aria-hidden="true" /></span>
                <div>
                  <strong>{t("shop.help.title")}</strong>
                  <p>{t("shop.help.subtitle")}</p>
                </div>
              </div>
              <div className="shop-help-actions">
                <Link to="/consult" className="btn btn--primary">{t("shop.help.button")} <FaArrowRight /></Link>
                <a href={whatsappLink("Hi Innovatech, I need help choosing or checking a product.")} target="_blank" rel="noreferrer" className="btn btn--ghost"><FaWhatsapp /> {t("shop.help.whatsapp")}</a>
              </div>
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
