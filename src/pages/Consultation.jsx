import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaArrowRight,
  FaCheckCircle,
  FaClipboardCheck,
  FaHandshake,
  FaLightbulb,
  FaReceipt,
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

const LEGAL_VERSION = "2026-10-21";

const REQUEST_TYPES = [
  {
    id: "product_check",
    labelKey: "consultation.requestTypes.productCheck.label",
    descriptionKey: "consultation.requestTypes.productCheck.description",
    icon: FaShieldAlt,
  },
  {
    id: "negotiate_purchase",
    labelKey: "consultation.requestTypes.negotiatePurchase.label",
    descriptionKey: "consultation.requestTypes.negotiatePurchase.description",
    icon: FaHandshake,
  },
  {
    id: "purchase_trace",
    labelKey: "consultation.requestTypes.purchaseTrace.label",
    descriptionKey: "consultation.requestTypes.purchaseTrace.description",
    icon: FaReceipt,
  },
  {
    id: "repair_analysis",
    labelKey: "consultation.requestTypes.repairAnalysis.label",
    descriptionKey: "consultation.requestTypes.repairAnalysis.description",
    icon: FaTools,
  },
  {
    id: "business_advice",
    labelKey: "consultation.requestTypes.businessAdvice.label",
    descriptionKey: "consultation.requestTypes.businessAdvice.description",
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
  legalAccepted: false,
  readyToBuy: false,
  referralCode: "",
  purchaseStage: "before_purchase",
  proofType: "store_receipt",
};

function makeTrackingReference() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INN-${new Date().getFullYear()}-${suffix}`;
}

export default function Consultation() {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL_FORM);
  const [session, setSession] = useState(null);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [saveNote, setSaveNote] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get("product");
    const request = params.get("request");
    const referralCode = params.get("ref") || "";
    const stage = params.get("stage");
    if (product || request || referralCode || stage) {
      setForm((current) => ({
        ...current,
        productName: product || current.productName,
        requestType: REQUEST_TYPES.some((item) => item.id === request) ? request : current.requestType,
        referralCode,
        purchaseStage: stage === "already_bought" ? "already_bought" : current.purchaseStage,
      }));
    }

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
    setFormError("");
  }

  async function submitRequest(event) {
    event.preventDefault();
    const isPurchaseTrace = form.requestType === "purchase_trace";
    if (isPurchaseTrace && form.purchaseStage === "already_bought" && !proofFile) {
      setFormError(t("consultation.form.proofRequired"));
      return;
    }
    setSaving(true);
    setFormError("");

    const selectedType = REQUEST_TYPES.find((item) => item.id === form.requestType);
    const legalAcceptedAt = new Date().toISOString();
    const isFreeNegotiation = form.requestType === "negotiate_purchase";
    const referralCode = isFreeNegotiation ? null : form.referralCode.trim() || null;
    const hasReferral = Boolean(referralCode);
    const requestId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const trackingReference = makeTrackingReference();
    const message = `Hi Innovatech, I would like an Innovatech Check.

Request: ${selectedType ? t(selectedType.labelKey) : form.requestType}
Name: ${form.name}
Phone / WhatsApp: ${form.phone}
Product or service: ${form.productName || "Not specified"}
Seller / store: ${form.sellerName || "Not specified"}
City: ${form.city || "Not specified"}
Link: ${form.productLink || "No link"}
Details: ${form.notes || "I will explain in the chat."}
Referral code: ${isFreeNegotiation ? "Not counted for negotiation" : form.referralCode || "None"}
Photo: ${photoName ? `${photoName} (I will send it in this WhatsApp chat)` : "I will send a photo in this chat if needed."}
Tracking reference: ${trackingReference}

${isFreeNegotiation
  ? "I am ready to buy if the store confirms availability and a final price. I understand that the negotiation is free, the store decides the final price and Innovatech does not guarantee a discount."
  : "Please confirm the consulting fee before starting. I understand that Innovatech will clearly say what was checked and will not claim to have bought or verified something it did not inspect."}
I accepted the Innovatech Terms of Service and Privacy Notice, version ${LEGAL_VERSION}.`;

    if (!isPurchaseTrace) {
      window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    }

    const { error } = await supabase.from("consultation_requests").insert({
      id: requestId,
      user_id: session?.user?.id || null,
      request_type: form.requestType,
      customer_name: form.name,
      phone: form.phone,
      product_name: form.productName || null,
      product_link: form.productLink || null,
      seller_name: form.sellerName || null,
      city: form.city || null,
      notes: form.notes || null,
      fee_acknowledged: isFreeNegotiation ? false : form.feeAcknowledged,
      ready_to_buy: isFreeNegotiation && form.readyToBuy,
      referral_code: referralCode,
      tracking_reference: trackingReference,
      terms_version: LEGAL_VERSION,
      terms_accepted_at: legalAcceptedAt,
      privacy_accepted_at: legalAcceptedAt,
      status: "pending",
    });

    if (error) {
      setSaveNote(isPurchaseTrace ? t("consultation.form.saveError") : t("consultation.form.whatsappReady"));
      setSubmitted(true);
      setSaving(false);
      return;
    }

    let proofError = null;
    if (isPurchaseTrace && proofFile) {
      const safeFileName = proofFile.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "") || "purchase-proof";
      const storagePath = `proofs/${requestId}/${Date.now()}-${safeFileName}`;
      const upload = await supabase.storage.from("purchase-proofs").upload(storagePath, proofFile, {
        cacheControl: "3600",
        contentType: proofFile.type,
        upsert: false,
      });
      proofError = upload.error;
      if (!proofError) {
        const proofInsert = await supabase.from("purchase_proofs").insert({
          consultation_request_id: requestId,
          user_id: session?.user?.id || null,
          proof_type: form.proofType,
          storage_path: storagePath,
          original_filename: proofFile.name,
          mime_type: proofFile.type,
        });
        proofError = proofInsert.error;
      }
    }

    setSaveNote(
      proofError
        ? t("consultation.form.proofUploadError")
        : isPurchaseTrace
          ? t(hasReferral ? "consultation.success.purchaseSaved" : "consultation.success.purchaseTracked", { reference: trackingReference })
        : isFreeNegotiation
          ? "Your free negotiation request is recorded. We will contact the store and return with its final price and availability."
          : "Your request is recorded, and the WhatsApp chat is ready for the next details."
    );
    setSubmitted(true);
    setSaving(false);
  }

  return (
    <main>
      <PageHero
        image="/images/hero-services.jpg"
        eyebrow={t("consultation.hero.eyebrow")}
        title={t("consultation.hero.title")}
        subtitle={t("consultation.hero.subtitle")}
      />
      <section className="section consultation-section">
        <div className="container">
          <SectionHeading eyebrow={t("consultation.section.eyebrow")} title={t("consultation.section.title")} subtitle={t("consultation.section.subtitle")} />
          <div className="consultation-grid">
            <Reveal className="consultation-form-card">
              {submitted ? (
                <div className="consultation-success">
                  <FaCheckCircle aria-hidden="true" />
                  <span className="eyebrow">{t("consultation.success.eyebrow")}</span>
                  <h2>{t("consultation.success.title")}</h2>
                  <p>{saveNote}</p>
                  <p className="consultation-small-note">{t("consultation.success.note")}</p>
                  <div className="form-actions">
                    <Link to="/shop" className="btn btn--secondary">{t("consultation.success.continueShopping")} <FaArrowRight /></Link>
                    <button type="button" className="btn btn--ghost" onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); setPhotoName(""); }}>{t("consultation.success.another")}</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submitRequest}>
                  <div className="consultation-type-grid">
                    {REQUEST_TYPES.map((type) => {
                      const Icon = type.icon;
                      return <button type="button" key={type.id} className={`consultation-type ${form.requestType === type.id ? "consultation-type--active" : ""}`} onClick={() => setForm((current) => ({ ...current, requestType: type.id }))}><Icon aria-hidden="true" /><strong>{t(type.labelKey)}</strong><span>{t(type.descriptionKey)}</span></button>;
                    })}
                  </div>

                  {form.requestType === "purchase_trace" && (
                    <div className="purchase-policy-callout">
                      <strong>{t("consultation.purchasePolicy.title")}</strong>
                      <ul>
                        <li>{t("consultation.purchasePolicy.point1")}</li>
                        <li>{t("consultation.purchasePolicy.point2")}</li>
                        <li>{t("consultation.purchasePolicy.point3")}</li>
                        <li>{t("consultation.purchasePolicy.point4")}</li>
                        <li>{t("consultation.purchasePolicy.point5")}</li>
                      </ul>
                    </div>
                  )}

                  <div className="consultation-form-grid">
                    <div className="form-row"><label htmlFor="consult-name">{t("consultation.form.name")}</label><input id="consult-name" name="name" value={form.name} onChange={updateField} required /></div>
                    <div className="form-row"><label htmlFor="consult-phone">{t("consultation.form.phone")}</label><input id="consult-phone" name="phone" value={form.phone} onChange={updateField} placeholder="+237 ..." required /></div>
                  </div>
                  <div className="consultation-form-grid">
                    <div className="form-row"><label htmlFor="consult-product">{t("consultation.form.product")}</label><input id="consult-product" name="productName" value={form.productName} onChange={updateField} placeholder="e.g. iPhone 13 Pro" /></div>
                    <div className="form-row"><label htmlFor="consult-city">{t("consultation.form.city")}</label><input id="consult-city" name="city" value={form.city} onChange={updateField} placeholder="e.g. Yaoundé" /></div>
                  </div>
                  <div className="consultation-form-grid">
                    <div className="form-row"><label htmlFor="consult-seller">{t("consultation.form.seller")}</label><input id="consult-seller" name="sellerName" value={form.sellerName} onChange={updateField} placeholder="Name or marketplace link" /></div>
                    <div className="form-row"><label htmlFor="consult-link">{t("consultation.form.link")}</label><input id="consult-link" name="productLink" type="url" value={form.productLink} onChange={updateField} placeholder="https://..." /></div>
                  </div>
                  <div className="form-row"><label htmlFor="consult-referral">{t("consultation.form.referral")}</label><input id="consult-referral" name="referralCode" value={form.referralCode} onChange={updateField} placeholder="e.g. INN-ABC123" /></div>
                  <div className="form-row"><label htmlFor="consult-notes">{t("consultation.form.notes")}</label><textarea id="consult-notes" name="notes" value={form.notes} onChange={updateField} rows="4" placeholder={t("consultation.form.notesPlaceholder")} /></div>

                  {form.requestType === "purchase_trace" && (
                    <>
                      <div className="consultation-purchase-options">
                        <span className="consultation-small-note">{t("consultation.form.purchaseStageLabel")}</span>
                        <label><input name="purchaseStage" type="radio" value="before_purchase" checked={form.purchaseStage === "before_purchase"} onChange={updateField} /> {t("consultation.form.beforePurchase")}</label>
                        <label><input name="purchaseStage" type="radio" value="already_bought" checked={form.purchaseStage === "already_bought"} onChange={updateField} /> {t("consultation.form.alreadyBought")}</label>
                      </div>
                      <div className="consultation-form-grid">
                        <div className="form-row"><label htmlFor="consult-proof-type">{t("consultation.form.proofType")}</label><select id="consult-proof-type" name="proofType" value={form.proofType} onChange={updateField}><option value="store_receipt">{t("consultation.form.storeReceipt")}</option><option value="mobile_money">{t("consultation.form.mobileMoney")}</option></select></div>
                        <label className="consultation-photo-field" htmlFor="consult-photo"><FaReceipt aria-hidden="true" /><span><strong>{photoName || t("consultation.form.proofTitle")}</strong><small>{t("consultation.form.proofHint")}</small></span><input id="consult-photo" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" capture="environment" onChange={(event) => { const file = event.target.files?.[0] || null; setProofFile(file); setPhotoName(file?.name || ""); setFormError(""); }} /></label>
                      </div>
                    </>
                  )}
                  {form.requestType !== "purchase_trace" && <label className="consultation-photo-field" htmlFor="consult-photo"><FaClipboardCheck aria-hidden="true" /><span><strong>{photoName || t("consultation.form.photoTitle")}</strong><small>{t("consultation.form.photoHint")}</small></span><input id="consult-photo" type="file" accept="image/*" capture="environment" onChange={(event) => setPhotoName(event.target.files?.[0]?.name || "")} /></label>}
                  {form.requestType === "negotiate_purchase" ? (
                    <label className="consultation-fee-check"><input name="readyToBuy" type="checkbox" checked={form.readyToBuy} onChange={updateField} required /><span>{t("consultation.form.readyToBuy")}</span></label>
                  ) : (
                    form.requestType === "purchase_trace"
                      ? <label className="consultation-fee-check"><input name="readyToBuy" type="checkbox" checked={form.readyToBuy} onChange={updateField} required /><span>{t("consultation.form.purchaseAcknowledgement")}</span></label>
                      : <label className="consultation-fee-check"><input name="feeAcknowledged" type="checkbox" checked={form.feeAcknowledged} onChange={updateField} required /><span>{t("consultation.form.feeAcknowledged")}</span></label>
                  )}
                  {formError && <p className="form-error">{formError}</p>}
                  <label className="legal-consent-check"><input name="legalAccepted" type="checkbox" checked={form.legalAccepted} onChange={updateField} required /><span>{t("consultation.form.legalBefore")} <Link to="/terms#purchase-tracking">{t("consultation.form.terms")}</Link> {t("consultation.form.legalAnd")} <Link to="/privacy">{t("consultation.form.privacy")}</Link>.</span></label>
                  <button type="submit" className="btn btn--primary" disabled={saving}>{form.requestType === "purchase_trace" ? <FaReceipt aria-hidden="true" /> : <FaWhatsapp aria-hidden="true" />} {saving ? t("consultation.form.preparing") : form.requestType === "purchase_trace" ? t("consultation.form.submitPurchase") : t("consultation.form.submit")}</button>
                </form>
              )}
            </Reveal>

            <Reveal className="consultation-trust-card" delay={0.1}>
              <span className="consultation-trust-icon"><FaShieldAlt aria-hidden="true" /></span>
              <span className="eyebrow">{t("consultation.trust.eyebrow")}</span>
              <h2>{t("consultation.trust.title")}</h2>
              <p>{t("consultation.trust.subtitle")}</p>
              <ul className="checklist"><li>{t("consultation.trust.point1")}</li><li>{t("consultation.trust.point2")}</li><li>{t("consultation.trust.point3")}</li><li>{t("consultation.trust.point4")}</li></ul>
              <div className="consultation-trust-note"><FaWhatsapp aria-hidden="true" /><span>{t("consultation.trust.note")}</span></div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
