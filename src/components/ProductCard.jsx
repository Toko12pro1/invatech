import React from "react";
import { withTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaClipboardCheck, FaMapMarkerAlt, FaShieldAlt, FaWhatsapp } from "react-icons/fa";
import Reveal from "./Reveal";
import { whatsappLink } from "../data/marketplace";

class ProductCard extends React.Component {
  render() {
    const { product, index = 0, t, i18n } = this.props;
    const name = product.getName(i18n.resolvedLanguage || i18n.language);
    const checkedDate = product.lastCheckedAt
      ? new Intl.DateTimeFormat(i18n.resolvedLanguage || i18n.language || "en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(product.lastCheckedAt))
      : null;
    const levelLabels = {
      seller_listed: t("shop.product.traceLevels.sellerListed"),
      store_reviewed: t("shop.product.traceLevels.storeReviewed"),
      innovatech_checked: t("shop.product.traceLevels.physicallyChecked"),
      innovatech_stock: t("shop.product.traceLevels.innovatechStock"),
    };
    const verificationLabel = levelLabels[product.verificationLevel] || t("shop.product.traceLevels.pending");
    const itemMessage = `Hi Innovatech, I would like help with this item.\n\nProduct: ${name}\nPrice shown: ${product.formatPrice()}\nStore: ${product.storeName}\nLocation: ${product.storeLocation}\n\nPlease confirm availability, help verify it or guide me on the best way to buy.`;

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
            {product.isFastDealActive && <span className="product-fast-deal-badge">{t("shop.product.fastDeal")}</span>}
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
              <span>{product.isFastDealActive ? t("shop.product.fastDealHelp") : product.negotiable ? t("shop.product.negotiable") : t("shop.product.verifyBeforeBuy")}</span>
            </div>
            <details className="product-traceability">
              <summary><FaShieldAlt aria-hidden="true" /> {t("shop.product.traceability")}</summary>
              <div className="product-traceability-body">
                <p>{product.verificationNote || t("shop.product.traceabilityDescription")}</p>
                <dl>
                  <div><dt>{t("shop.product.level")}</dt><dd>{verificationLabel}</dd></div>
                  {checkedDate && <div><dt>{t("shop.product.lastChecked")}</dt><dd>{checkedDate}</dd></div>}
                  {product.verifiedBy && <div><dt>{t("shop.product.recordedBy")}</dt><dd>{product.verifiedBy}</dd></div>}
                  {product.verificationReference && <div><dt>{t("shop.product.reference")}</dt><dd>{product.verificationReference}</dd></div>}
                  {product.verificationScope.length > 0 && <div><dt>{t("shop.product.scope")}</dt><dd>{product.verificationScope.join(" · ")}</dd></div>}
                </dl>
                <small>{t("shop.product.traceabilityWarning")}</small>
              </div>
            </details>
            <div className="product-price">
              <span>{product.formatPrice()}</span>
              {product.isOnSale && (
                <span className="product-price-old">{product.formatPrice(product.oldPrice)}</span>
              )}
            </div>
            <a
              href={whatsappLink(itemMessage)}
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary product-cta"
            >
              <FaWhatsapp aria-hidden="true" /> {t("shop.product.chat")}
            </a>
            <Link className="product-consult-link" to={`/consult?product=${encodeURIComponent(name)}&request=negotiate_purchase&seller=${encodeURIComponent(product.storeName)}`}>
              <FaClipboardCheck aria-hidden="true" /> {t("shop.product.negotiate")}
            </Link>
          </div>
        </motion.article>
      </Reveal>
    );
  }
}

export default withTranslation()(ProductCard);
