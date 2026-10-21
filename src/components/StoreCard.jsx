import React from "react";
import { FaMapMarkerAlt, FaShieldAlt, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { whatsappLink } from "../data/marketplace";

export default class StoreCard extends React.Component {
  render() {
    const { store, index = 0 } = this.props;
    const message = `Hi ${store.name}, I found your store through Innovatech. I would like to ask about your available products.`;
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
          </div>
        </motion.article>
      </Reveal>
    );
  }
}
