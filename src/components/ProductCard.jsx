import React from "react";
import { withTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaClipboardCheck, FaMapMarkerAlt, FaShieldAlt, FaWhatsapp } from "react-icons/fa";
import Reveal from "./Reveal";

class ProductCard extends React.Component {
  render() {
    const { product, index = 0, t, i18n } = this.props;
    const name = product.getName(i18n.resolvedLanguage || i18n.language);
    const checkedDate = product.lastCheckedAt
      ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(product.lastCheckedAt))
      : null;
    const levelLabels = {
      seller_listed: "Seller listing",
      store_reviewed: "Store reviewed",
      innovatech_checked: "Physically checked",
      innovatech_stock: "Innovatech stock",
    };
    const verificationLabel = levelLabels[product.verificationLevel] || "Traceability pending";

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
            {product.isFastDealActive && <span className="product-fast-deal-badge">Fast Deal</span>}
          </div>
          <div className="product-card-body">
            <span className="product-condition">{t(`common.conditions.${product.condition}`)}</span>
            <h3>{name}</h3>
            <div className="product-card-store">
              <span><FaMapMarkerAlt aria-hidden="true" /> {product.storeName}</span>
              <span className="product-card-verified"><FaShieldAlt aria-hidden="true" /> {verificationLabel}</span>
            </div>
            <span className="product-card-location">{product.storeLocation}</span>
            <div className="product-card-consultant">
              <FaClipboardCheck aria-hidden="true" />
              <span>{product.isFastDealActive ? "Fast Deal · ask us to negotiate" : product.negotiable ? "Negotiable through Innovatech" : "Ask us to verify before you buy"}</span>
            </div>
            <details className="product-traceability">
              <summary><FaShieldAlt aria-hidden="true" /> See traceability</summary>
              <div className="product-traceability-body">
                <p>{product.verificationNote || "The listing status and the exact scope of any Innovatech check are shown here."}</p>
                <dl>
                  <div><dt>Level</dt><dd>{verificationLabel}</dd></div>
                  {checkedDate && <div><dt>Last checked</dt><dd>{checkedDate}</dd></div>}
                  {product.verifiedBy && <div><dt>Recorded by</dt><dd>{product.verifiedBy}</dd></div>}
                  {product.verificationReference && <div><dt>Reference</dt><dd>{product.verificationReference}</dd></div>}
                  {product.verificationScope.length > 0 && <div><dt>Scope</dt><dd>{product.verificationScope.join(" · ")}</dd></div>}
                </dl>
                <small>Ask us for a fresh physical check before paying. A listing review is not the same as a device test.</small>
              </div>
            </details>
            <div className="product-price">
              <span>{product.formatPrice()}</span>
              {product.isOnSale && (
                <span className="product-price-old">{product.formatPrice(product.oldPrice)}</span>
              )}
            </div>
            <Link
              to={`/consult?product=${encodeURIComponent(name)}&request=negotiate_purchase`}
              className="btn btn--primary product-cta"
            >
              <FaWhatsapp aria-hidden="true" /> Start free negotiation
            </Link>
            <Link className="product-consult-link" to={`/consult?product=${encodeURIComponent(name)}&request=negotiate_purchase`}>
              Ready to buy? Ask us to negotiate free
            </Link>
          </div>
        </motion.article>
      </Reveal>
    );
  }
}

export default withTranslation()(ProductCard);
