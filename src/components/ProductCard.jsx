import React from "react";
import { withTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaClipboardCheck, FaFacebookF, FaMapMarkerAlt, FaReceipt, FaShareAlt, FaShieldAlt, FaWhatsapp } from "react-icons/fa";
import Reveal from "./Reveal";
import { whatsappLink } from "../data/marketplace";
import { trackMetaEvent } from "../lib/metaPixel";
import { buildProductShareLink, buildStoreShareLink, getStoredReferralCode } from "../utils/referrals";
import { buildFacebookShareLink, shareOrCopy } from "../utils/sharing";

class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { shareNotice: "" };
    this.handleShare = this.handleShare.bind(this);
  }

  async handleShare() {
    const { product, i18n, t } = this.props;
    const name = product.getName(i18n.resolvedLanguage || i18n.language);
    const referralCode = getStoredReferralCode();
    const link = buildProductShareLink(product.id, referralCode);
    const message = `Check this product on Innovatech: ${name} — ${product.formatPrice()}\n${link}`;

    try {
      const result = await shareOrCopy({ title: name, text: message, url: link });
      if (result === "copied") {
        this.setState({ shareNotice: t("shop.product.shareCopied", "Product link copied") });
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        this.setState({ shareNotice: t("shop.product.shareCopyFailed", "Copy the link from your browser to share it") });
      }
    }
  }

  render() {
    const { product, index = 0, t, i18n, highlighted } = this.props;
    const { shareNotice } = this.state;
    const name = product.getName(i18n.resolvedLanguage || i18n.language);
    const referralCode = getStoredReferralCode();
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
    const consultationType = product.isFastDealActive || product.negotiable ? "negotiate_purchase" : "product_check";
    const consultationParams = new URLSearchParams({ product: name, productId: product.id, request: consultationType, seller: product.storeName });
    if (product.storeId) consultationParams.set("storeId", product.storeId);
    if (referralCode) consultationParams.set("ref", referralCode);
    const consultationLink = `/consult?${consultationParams.toString()}`;
    const shareLink = buildProductShareLink(product.id, referralCode);
    const storeLink = product.storeId ? buildStoreShareLink(product.storeId, referralCode) : "No linked store page";
    const itemMessage = `Hi Innovatech, I would like help with this item.\n\nProduct: ${name}\nPrice shown: ${product.formatPrice()}\nStore: ${product.storeName}\nLocation: ${product.storeLocation}\nProduct link: ${shareLink}\nStore page: ${storeLink}\n\nPlease confirm availability, help verify it or guide me on the best way to buy.`;
    const storeDigits = String(product.storeWhatsapp || "").replace(/\D/g, "");
    const hasDirectStoreContact = storeDigits.length >= 10 && !String(product.storeWhatsapp).includes("X");
    const facebookShareLink = buildFacebookShareLink(shareLink);
    const purchaseParams = new URLSearchParams({ product: name, productId: product.id, request: "purchase_trace", seller: product.storeName });
    const negotiateParams = new URLSearchParams({ product: name, productId: product.id, request: "negotiate_purchase", seller: product.storeName });
    if (product.storeId) {
      purchaseParams.set("storeId", product.storeId);
      negotiateParams.set("storeId", product.storeId);
    }
    if (referralCode) {
      purchaseParams.set("ref", referralCode);
      negotiateParams.set("ref", referralCode);
    }

    return (
      <Reveal delay={index * 0.06} className="product-card-wrap">
        <motion.article id={`product-${product.id}`} className={`product-card ${highlighted ? "product-card--highlighted" : ""}`} whileHover={{ y: -4 }} transition={{ duration: 0.18, ease: "easeOut" }}>
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
            {product.fastDealExpired && <span className="product-fast-deal-badge product-fast-deal-badge--ended">{t("shop.product.fastDealEnded")}</span>}
          </div>
          <div className="product-card-body">
            <span className="product-condition">{t(`common.conditions.${product.condition}`)}</span>
            <Link className="product-card-title-link" to={`/product/${encodeURIComponent(product.id)}`}>
              <h3>{name}</h3>
            </Link>
            <div className="product-card-store">
              <span><FaMapMarkerAlt aria-hidden="true" /> {product.storeName}</span>
              <span className="product-card-verified"><FaShieldAlt aria-hidden="true" /> {verificationLabel}</span>
            </div>
            <span className="product-card-location">{product.storeLocation}</span>
            {product.fastDealExpired && <p className="product-fast-deal-ended-note">{t("shop.product.fastDealEndedNotice")}</p>}
            <Link className="product-card-consultant product-card-consultant--link" to={consultationLink}>
              <FaClipboardCheck aria-hidden="true" />
              <span>{product.isFastDealActive ? t("shop.product.fastDealHelp") : product.negotiable ? t("shop.product.negotiable") : t("shop.product.verifyBeforeBuy")}</span>
            </Link>
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
            <details className="product-purchase-policy">
              <summary><FaReceipt aria-hidden="true" /> {t("shop.product.beforeBuy")}</summary>
              <ul>
                <li>{t("shop.product.beforeBuyPoint1")}</li>
                <li>{t("shop.product.beforeBuyPoint2")}</li>
                <li>{t("shop.product.beforeBuyPoint3")}</li>
              </ul>
            </details>
            <div className="product-price">
              <span>{product.formatPrice()}</span>
              {product.isOnSale && (
                <span className="product-price-old">{product.formatPrice(product.oldPrice)}</span>
              )}
            </div>
            <a
              href={whatsappLink(itemMessage, hasDirectStoreContact ? product.storeWhatsapp : undefined)}
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary product-cta"
              onClick={() => trackMetaEvent("Contact", { content_name: name, content_category: product.category })}
            >
              <FaWhatsapp aria-hidden="true" /> {hasDirectStoreContact ? t("shop.product.chatStore", "Chat with store") : t("shop.product.chat")}
            </a>
            <div className="product-share-actions">
              <button type="button" className="product-share-link" onClick={this.handleShare} title={shareLink}>
                <FaShareAlt aria-hidden="true" /> {t("shop.product.share", "Share & refer")}
              </button>
              <a className="product-share-link product-share-link--facebook" href={facebookShareLink} target="_blank" rel="noreferrer">
                <FaFacebookF aria-hidden="true" /> {t("shop.product.facebook", "Facebook")}
              </a>
            </div>
            {shareNotice && <small className="product-share-notice" role="status">{shareNotice}</small>}
            <Link className="product-purchase-link" to={`/consult?${purchaseParams.toString()}`} onClick={() => trackMetaEvent("Lead", { content_name: name, content_category: product.category, content_type: "purchase_trace" })}>
              <FaReceipt aria-hidden="true" /> {t("shop.product.trackPurchase")}
            </Link>
            <Link className="product-consult-link" to={`/consult?${negotiateParams.toString()}`} onClick={() => trackMetaEvent("Lead", { content_name: name, content_category: product.category, content_type: "negotiation" })}>
              <FaClipboardCheck aria-hidden="true" /> {t("shop.product.negotiate")}
            </Link>
          </div>
        </motion.article>
      </Reveal>
    );
  }
}

export default withTranslation()(ProductCard);
