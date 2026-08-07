import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import Reveal from "./Reveal";

export default class ProductCard extends React.Component {
  render() {
    const { product, index = 0 } = this.props;
    const message = encodeURIComponent(`Hi Innovatech, I'm interested in the ${product.name}.`);

    return (
      <Reveal delay={index * 0.06} className="product-card-wrap">
        <motion.article className="product-card" whileHover={{ y: -6 }}>
          <div className="product-card-image">
            <img src={product.image} alt={product.name} loading="lazy" />
            {product.badge && <span className="product-badge">{product.badge}</span>}
            {product.isOnSale && (
              <span className="product-badge product-badge--sale">
                -{product.discountPercent}%
              </span>
            )}
          </div>
          <div className="product-card-body">
            <span className="product-condition">{product.condition}</span>
            <h3>{product.name}</h3>
            <div className="product-price">
              <span>{product.formatPrice()}</span>
              {product.isOnSale && (
                <span className="product-price-old">{product.formatPrice(product.oldPrice)}</span>
              )}
            </div>
            <a
              href={`https://wa.me/237600000000?text=${message}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary product-cta"
            >
              <FaWhatsapp aria-hidden="true" /> Enquire
            </a>
          </div>
        </motion.article>
      </Reveal>
    );
  }
}
