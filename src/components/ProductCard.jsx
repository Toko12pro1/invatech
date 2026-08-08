import React from "react";
import { withTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import Reveal from "./Reveal";

class ProductCard extends React.Component {
  render() {
    const { product, index = 0, t } = this.props;
    const name = t(product.translationKey("name"));
    const message = encodeURIComponent(`Hi Innovatech, I'm interested in the ${name}.`);

    return (
      <Reveal delay={index * 0.06} className="product-card-wrap">
        <motion.article className="product-card" whileHover={{ y: -6 }}>
          <div className="product-card-image">
            <img src={product.image} alt={name} loading="lazy" />
            {product.badge && (
              <span className="product-badge">{t(`common.badges.${product.badge}`)}</span>
            )}
            {product.isOnSale && (
              <span className="product-badge product-badge--sale">
                -{product.discountPercent}%
              </span>
            )}
          </div>
          <div className="product-card-body">
            <span className="product-condition">{t(`common.conditions.${product.condition}`)}</span>
            <h3>{name}</h3>
            <div className="product-price">
              <span>{product.formatPrice()}</span>
              {product.isOnSale && (
                <span className="product-price-old">{product.formatPrice(product.oldPrice)}</span>
              )}
            </div>
            <a
              href={`https://wa.me/237651162373?text=${message}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary product-cta"
            >
              <FaWhatsapp aria-hidden="true" /> {t("common.enquire")}
            </a>
          </div>
        </motion.article>
      </Reveal>
    );
  }
}

export default withTranslation()(ProductCard);
