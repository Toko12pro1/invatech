import React, { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCheckCircle,
  FaClipboardCheck,
  FaHandshake,
  FaLightbulb,
  FaShieldAlt,
  FaTools,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { whatsappLink } from "../data/marketplace";
import { supabase } from "../lib/supabaseClient";

const REQUEST_TYPES = [
  {
    id: "product_check",
    label: "Check a product",
    description: "We review the phone or electronics before you spend money.",
    icon: FaShieldAlt,
  },
  {
    id: "negotiate_purchase",
    label: "Buy or bargain for me",
    description: "We contact the seller and help you reach a fair price.",
    icon: FaHandshake,
  },
  {
    id: "repair_analysis",
    label: "Analyse a repair",
    description: "We assess the problem and explain the realistic next step.",
    icon: FaTools,
  },
  {
    id: "business_advice",
    label: "Technology advice",
    description: "Get practical guidance for software, devices or a business need.",
    icon: FaLightbulb,
  },
];

const INITIAL_FORM = {
  requestType: "product_check",
  name: "",
  phone: "",
  productName: "",
  productLink: "",
  sellerName: "",
  city: "Yaoundé",
  notes: "",
  feeAcknowledged: false,
};

export default function Consultation() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [session, setSession] = useState(null);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const [saveNote, setSaveNote] = useState("");

  useEffect(() => {
    const product = new URLSearchParams(window.location.search).get("product");
    if (product) setForm((current) => ({ ...current, productName: product }));

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active || !data.session) return;
      const user = data.session.user;
      setSession(data.session);
      setForm((current) => ({
        ...current,
        name: user.user_metadata?.full_name || current.name,
        phone: user.user_metadata?.phone || current.phone,
      }));
    });
    return () => {
      active = false;
    };
  }, []);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function submitRequest(event) {
    event.preventDefault();
    setSaving(true);

    const selectedType = REQUEST_TYPES.find((item) => item.id === form.requestType);
    const message = `Hi Innovatech, I would like an Innovatech Check.

Request: ${selectedType?.label || form.requestType}
Name: ${form.name}
Phone / WhatsApp: ${form.phone}
Product or service: ${form.productName || "Not specified"}
Seller / store: ${form.sellerName || "Not specified"}
City: ${form.city || "Not specified"}
Link: ${form.productLink || "No link"}
Details: ${form.notes || "I will explain in the chat."}
Photo: ${photoName ? `${photoName} (I will send it in this WhatsApp chat)` : "I will send a photo in this chat if needed."}

Please confirm the consulting fee before starting. I understand that Innovatech will clearly say what was checked and will not claim to have bought or verified something it did not inspect.`;

    // Open WhatsApp during the button action so mobile browsers do not block it.
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");

    const { error } = await supabase.from("consultation_requests").insert({
      user_id: session?.user?.id || null,
      request_type: form.requestType,
      customer_name: form.name,
      phone: form.phone,
      product_name: form.productName || null,
      product_link: form.productLink || null,
      seller_name: form.sellerName || null,
      city: form.city || null,
      notes: form.notes || null,
      fee_acknowledged: form.feeAcknowledged,
      status: "pending",
    });

    setSaveNote(
      error
        ? "Your WhatsApp chat is ready. If you selected a photo, send it in that chat so we can review it."
        : "Your request is recorded, and the WhatsApp chat is ready for the next details."
    );
    setSubmitted(true);
    setSaving(false);
  }

  return (
    <main>
      <PageHero
        image="/images/hero-services.jpg"
        eyebrow="Innovatech Check"
        title="Get a second opinion before you spend."
        subtitle="Ask us to check a product, negotiate for you, analyse a repair or guide you through a technology decision."
      />

      <section className="section consultation-section">
        <div className="container">
          <SectionHeading
            eyebrow="One clear process"
            title="Tell us what you need help with."
            subtitle="Choose a service, share the basics and continue the conversation on WhatsApp. Photos can be sent there after you submit."
          />

          <div className="consultation-grid">
            <Reveal className="consultation-form-card">
              {submitted ? (
                <div className="consultation-success">
                  <FaCheckCircle aria-hidden="true" />
                  <span className="eyebrow">Request started</span>
                  <h2>WhatsApp is ready.</h2>
                  <p>{saveNote}</p>
                  <p className="consultation-small-note">We will confirm the fee and the exact scope before any paid analysis or negotiation begins.</p>
                  <div className="form-actions">
                    <Link to="/shop" className="btn btn--secondary">Continue shopping <FaArrowRight /></Link>
                    <button className="btn btn--ghost" onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); setPhotoName(""); }}>Start another request</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submitRequest}>
                  <div className="consultation-type-grid">
                    {REQUEST_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          type="button"
                          key={type.id}
                          className={`consultation-type ${form.requestType === type.id ? "consultation-type--active" : ""}`}
                          onClick={() => setForm((current) => ({ ...current, requestType: type.id }))}
                        >
                          <Icon aria-hidden="true" />
                          <strong>{type.label}</strong>
                          <span>{type.description}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="consultation-form-grid">
                    <div className="form-row">
                      <label htmlFor="consult-name">Your name</label>
                      <input id="consult-name" name="name" value={form.name} onChange={updateField} required />
                    </div>
                    <div className="form-row">
                      <label htmlFor="consult-phone">Phone / WhatsApp</label>
                      <input id="consult-phone" name="phone" value={form.phone} onChange={updateField} placeholder="+237 ..." required />
                    </div>
                  </div>

                  <div className="consultation-form-grid">
                    <div className="form-row">
                      <label htmlFor="consult-product">Product or service</label>
                      <input id="consult-product" name="productName" value={form.productName} onChange={updateField} placeholder="e.g. iPhone 13 Pro" />
                    </div>
                    <div className="form-row">
                      <label htmlFor="consult-city">City / area</label>
                      <input id="consult-city" name="city" value={form.city} onChange={updateField} placeholder="e.g. Yaoundé" />
                    </div>
                  </div>

                  <div className="consultation-form-grid">
                    <div className="form-row">
                      <label htmlFor="consult-seller">Seller or store (optional)</label>
                      <input id="consult-seller" name="sellerName" value={form.sellerName} onChange={updateField} placeholder="Name or marketplace link" />
                    </div>
                    <div className="form-row">
                      <label htmlFor="consult-link">Product link (optional)</label>
                      <input id="consult-link" name="productLink" type="url" value={form.productLink} onChange={updateField} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="form-row">
                    <label htmlFor="consult-notes">What should we check or negotiate?</label>
                    <textarea id="consult-notes" name="notes" value={form.notes} onChange={updateField} rows="4" placeholder="Tell us the price, the problem, your budget or anything you already know." />
                  </div>

                  <label className="consultation-photo-field" htmlFor="consult-photo">
                    <FaClipboardCheck aria-hidden="true" />
                    <span><strong>{photoName || "Have a photo? Select it from your phone"}</strong><small>We do not upload it here; send the photo in the WhatsApp chat that opens next.</small></span>
                    <input id="consult-photo" type="file" accept="image/*" capture="environment" onChange={(event) => setPhotoName(event.target.files?.[0]?.name || "")} />
                  </label>

                  <label className="consultation-fee-check">
                    <input name="feeAcknowledged" type="checkbox" checked={form.feeAcknowledged} onChange={updateField} required />
                    <span>I understand that the consulting fee is confirmed with me before work starts.</span>
                  </label>

                  <button type="submit" className="btn btn--primary" disabled={saving}>
                    <FaWhatsapp aria-hidden="true" /> {saving ? "Preparing your request..." : "Continue on WhatsApp"}
                  </button>
                </form>
              )}
            </Reveal>

            <Reveal className="consultation-trust-card" delay={0.1}>
              <span className="consultation-trust-icon"><FaShieldAlt aria-hidden="true" /></span>
              <span className="eyebrow">Our promise</span>
              <h2>Honest help, not a fake guarantee.</h2>
              <p>We may charge for our time and analysis. That fee is discussed first, so you know exactly what you are paying for.</p>
              <ul className="checklist">
                <li>We say what we checked and what we could not check.</li>
                <li>We do not pretend to own or have tested a product.</li>
                <li>We disclose the next step before you commit money.</li>
                <li>For repairs, a final guarantee comes only after physical inspection.</li>
              </ul>
              <div className="consultation-trust-note"><FaWhatsapp aria-hidden="true" /><span>We are building our reputation through transparent advice and accountable conversations.</span></div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
