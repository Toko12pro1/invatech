import React from "react";
import { FaFacebookF, FaMapMarkerAlt, FaShareAlt, FaShieldAlt, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { Link } from "react-router-dom";
import { whatsappLink } from "../data/marketplace";
import { buildStoreShareLink } from "../utils/referrals";
import { buildFacebookShareLink, shareOrCopy } from "../utils/sharing";

export default class StoreCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { shareNotice: "" };
    this.handleShare = this.handleShare.bind(this);
  }

  async handleShare() {
    const { store } = this.props;
    const url = buildStoreShareLink(store.id);
    try {
      const result = await shareOrCopy({ title: store.name, text: `See ${store.name} on Innovatech`, url });
      if (result === "copied") this.setState({ shareNotice: "Store link copied" });
    } catch (error) {
      if (error?.name !== "AbortError") this.setState({ shareNotice: "Copy the store link to share it" });
    }
  }

  render() {
    const { store, index = 0 } = this.props;
    const { shareNotice } = this.state;
    const storeShareLink = buildStoreShareLink(store.id);
    const message = `Hi ${store.name}, I found your store through Innovatech. I would like to ask about your available products.\n\nStore page: ${storeShareLink}`;
    const storeDigits = String(store.whatsapp || "").replace(/\D/g, "");
    const hasDirectStoreContact = storeDigits.length >= 10 && !String(store.whatsapp).includes("X");

    return (
      <Reveal delay={index * 0.08} className="store-card-wrap">
        <motion.article className="store-card" whileHover={{ y: -7 }}>
          <div className="store-card-image">
            <img src={store.image} alt="" loading="lazy" />
            <span className="store-card-badge"><FaShieldAlt /> Verified partner</span>
          </div>
          <div className="store-card-body">
            <span className="eyebrow">{store.category}</span>
            <h3>{store.name}</h3>
            <p>{store.description}</p>
            <div className="store-card-meta">
              <span><FaMapMarkerAlt /> {store.location}</span>
              <span>{store.responseTime}</span>
            </div>
            <a href={whatsappLink(message, store.whatsapp)} target="_blank" rel="noreferrer" className="btn btn--primary store-card-cta">
              <FaWhatsapp aria-hidden="true" /> {hasDirectStoreContact ? "Chat with store" : "Ask Innovatech about this store"}
            </a>
            <div className="store-card-actions">
              <Link className="store-card-link" to={`/store/${encodeURIComponent(store.id)}`}><FaShareAlt aria-hidden="true" /> View store</Link>
              <button type="button" className="store-card-link" onClick={this.handleShare}><FaShareAlt aria-hidden="true" /> Share</button>
              <a className="store-card-link store-card-link--facebook" href={buildFacebookShareLink(storeShareLink)} target="_blank" rel="noreferrer"><FaFacebookF aria-hidden="true" /> Facebook</a>
            </div>
            {shareNotice && <small className="product-share-notice" role="status">{shareNotice}</small>}
          </div>
        </motion.article>
      </Reveal>
    );
  }
}
