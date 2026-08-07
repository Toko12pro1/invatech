import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

const CATEGORIES = ["All", ...new Set(products.map((product) => product.category))];

export default class Shop extends BasePage {
  constructor(props) {
    super(props);
    this.state = { activeCategory: "All" };
    this.setCategory = this.setCategory.bind(this);
  }

  setCategory(category) {
    this.setState({ activeCategory: category });
  }

  getFilteredProducts() {
    const { activeCategory } = this.state;
    if (activeCategory === "All") return products;
    return products.filter((product) => product.category === activeCategory);
  }

  renderPage() {
    const filtered = this.getFilteredProducts();

    return (
      <>
        <PageHero
          image="/images/hero-shop.jpg"
          eyebrow="Shop"
          title="New & Fairly-Used Electronics, Fully Verified"
          subtitle="Every device is tested in-house before it reaches you, with warranty included."
        />

        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Browse" title="Available Devices" />

            <Reveal className="shop-filters">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`filter-pill ${this.state.activeCategory === category ? "filter-pill--active" : ""}`}
                  onClick={() => this.setCategory(category)}
                >
                  {category}
                </button>
              ))}
            </Reveal>

            <div className="grid grid--3">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="cta-banner">
          <div className="container cta-banner-inner">
            <Reveal>
              <h2>Looking for something specific, or want to trade in a device?</h2>
              <p>Message us on WhatsApp — we restock regularly and can source on request.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <a
                href="https://wa.me/237600000000"
                target="_blank"
                rel="noreferrer"
                className="btn btn--dark"
              >
                <FaWhatsapp aria-hidden="true" /> Chat With Us
              </a>
            </Reveal>
          </div>
        </section>
      </>
    );
  }
}
