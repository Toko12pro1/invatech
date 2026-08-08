import React from "react";
import { withTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

const CATEGORIES = ["All", ...new Set(products.map((product) => product.category))];

class Shop extends BasePage {
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
    const { t } = this.props;

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

            <Reveal className="shop-filters">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`filter-pill ${this.state.activeCategory === category ? "filter-pill--active" : ""}`}
                  onClick={() => this.setCategory(category)}
                >
                  {t(`shop.categories.${category}`)}
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
              <h2>{t("shop.cta.title")}</h2>
              <p>{t("shop.cta.subtitle")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <a
                href="https://wa.me/237651162373"
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
