import React from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";

const UPDATED = "21 October 2026";

function ContactBlock() {
  return <p className="legal-contact"><strong>Innovatech Engineering Solutions</strong><br />Yaounde, Cameroon<br />WhatsApp: +237 651 162 373<br />Email: <a href="mailto:hello@innovatech.cm">hello@innovatech.cm</a></p>;
}

export default function Terms() {
  return (
    <main>
      <PageHero image="/images/hero-services.jpg" eyebrow="Legal information" title="Terms of Service" subtitle="Clear rules for our marketplace, verification, consulting, repairs, referrals and software services." />
      <section className="section legal-section">
        <div className="container legal-layout">
          <article className="legal-document">
            <div className="legal-meta">Last updated: {UPDATED} · English version</div>
            <p className="legal-lead">These Terms explain how Innovatech works with customers, partner stores and service clients. Please read them before requesting a paid service, placing an order or submitting a product listing.</p>

            <h2>1. Who we are</h2>
            <p>Innovatech Engineering Solutions is a technology business based in Cameroon. We operate this website, connect customers with partner stores, provide technology consulting and repairs, and develop software. Contact details are below. When we are not the seller named on an invoice, we act as a marketplace connector and consultant, not as the owner of the partner store's product.</p>

            <h2>2. The different services</h2>
            <ul>
              <li><strong>Partner-store listing:</strong> the store remains responsible for its product, price, availability, invoice, warranty and after-sales obligations unless the written order says Innovatech is the seller.</li>
              <li><strong>Innovatech stock:</strong> when the invoice identifies Innovatech as seller, the invoice and written warranty govern the sale.</li>
              <li><strong>Innovatech Check:</strong> we may review a listing, inspect a device, negotiate or give technology advice. The scope, fee and expected result are confirmed before paid work starts.</li>
              <li><strong>Repairs and software:</strong> these are separate services with a written diagnosis, quotation, scope, delivery estimate and applicable warranty where relevant.</li>
            </ul>

            <h2>3. Product listings and traceability</h2>
            <p>We show the store, location, price, condition and traceability level where available. “Store reviewed” means we reviewed the store or listing; it does not mean that Innovatech physically tested the device. “Physically checked” is used only when our team records an actual check. A traceability reference identifies the record, but it is not a guarantee that a device will never fail or that every defect can be detected.</p>
            <p>Customers should request a fresh check before paying when the listing is old, the price has changed, or the product is second-hand. We do not publish full IMEI numbers, identity documents or other sensitive information.</p>

            <h2>4. Store-owner rules</h2>
            <p>A store owner must provide accurate information, have the right to sell the product, keep prices and availability current, and disclose defects, condition, ownership issues and relevant warranty terms. Listings for stolen, counterfeit, unsafe, illegal or misleading products are prohibited. We may suspend or remove a listing or store while we investigate a complaint.</p>

            <h2>5. Prices, orders and payment</h2>
            <p>Prices are shown in FCFA unless stated otherwise. A displayed price is an offer or indication, not a completed sale. Availability, seller identity, delivery or collection, taxes, warranty, payment method, return conditions and the final total will be confirmed before an order is accepted. Do not send money to a personal number or account unless the written order or invoice identifies the recipient and amount.</p>
            <p>A WhatsApp conversation is not automatically an accepted order. Your order is accepted only when we or the named store confirm it in writing, with the seller, item, total, payment instructions and fulfilment terms.</p>

            <h2>6. Consulting and verification fees</h2>
            <p>Ready-to-buy negotiation may be offered free when the request is clearly marked as such and the customer confirms they are ready to buy if the store confirms availability and a final price. The store decides the final price; Innovatech does not guarantee a discount. Other consulting, negotiation or inspection fees are disclosed with the scope before starting. A paid fee does not guarantee a purchase, repair result, authenticity, future performance or successful negotiation.</p>

            <h2>7. Repairs and warranties</h2>
            <p>A diagnosis is not the same as a completed repair. We will identify the reported fault, proposed work, parts, price, expected timing and any repair warranty in the quotation or receipt. Additional defects found after opening a device require your approval where practicable. Mandatory consumer rights and remedies under applicable Cameroon law are not removed by these Terms.</p>

            <h2>8. Fast Deals</h2>
            <p>Fast Deal means a seller has marked an item for a time-limited or urgent sale. It does not prove that the price is the lowest in Cameroon, that the product is authentic, or that the item will remain available. We may verify or negotiate the item, but the seller controls final availability unless Innovatech is identified as seller.</p>

            <h2>9. Referrals</h2>
            <p>Referral codes identify a referrer; they are not money, employment or a guaranteed income. The code is captured with the request, but a reward is considered only after we confirm a qualifying completed transaction with the store. We may refuse duplicate, fraudulent, self-referred, cancelled or disputed transactions. If a store or partner pays Innovatech or a referrer a referral commission, we will not describe the service as “no gain” where that commission is relevant, and the customer will not be charged a hidden markup. No spam, impersonation, misleading advertising or multi-level recruitment is allowed.</p>

            <h2>10. WhatsApp and other services</h2>
            <p>Some requests open WhatsApp, email, Supabase or other third-party services. Their own terms and privacy notices apply. Messages sent through WhatsApp can be seen and processed by WhatsApp and the people in the conversation. Do not send passwords, banking PINs, identity documents or a full IMEI through a public chat.</p>

            <h2>11. Acceptable use and intellectual property</h2>
            <p>You must not use the website to commit fraud, impersonate another person, upload unlawful content, interfere with security, scrape private data, or infringe another person's rights. Innovatech owns or licenses the website, branding, software, text, graphics and portfolio materials. Store owners keep ownership of their content but give us permission to display it for listing, support and promotion purposes until they ask us to remove it or the listing ends.</p>

            <h2>12. Complaints, cancellation and returns</h2>
            <p>Send a complaint to <a href="mailto:hello@innovatech.cm">hello@innovatech.cm</a> or WhatsApp +237 651 162 373 with your order/reference, seller, date, photos and requested remedy. We will identify whether the issue concerns Innovatech, a partner store or a third-party service and route it accordingly. Any applicable statutory cancellation, withdrawal, repair, replacement, refund and compensation rights remain available; the order confirmation will state the process and any lawful exceptions. We do not use a blanket “no refund in all circumstances” clause.</p>

            <h2>13. Liability</h2>
            <p>We are not responsible for a partner store's product or conduct where the store is the seller, but we will handle complaints in good faith and cooperate with the customer and store. Nothing in these Terms excludes or limits liability that cannot lawfully be excluded, including mandatory consumer rights, fraud or personal injury caused by negligence.</p>

            <h2>14. Governing law and changes</h2>
            <p>These Terms are intended to be governed by the laws of Cameroon. We may update them when our services or the law changes. The version shown at the time of a confirmed order or accepted service request applies to that transaction, unless a mandatory law requires otherwise.</p>

            <h2>15. Contact</h2>
            <ContactBlock />

            <hr />
            <div className="legal-meta">Version française</div>
            <h2>Conditions générales de service</h2>
            <p className="legal-lead">Cette version française résume les mêmes règles. En cas de différence involontaire, nous vous fournirons une clarification écrite avant toute commande ou prestation payante.</p>

            <h3>1. Notre rôle</h3>
            <p>Innovatech Engineering Solutions est une entreprise technologique camerounaise. Nous exploitons ce site, mettons en relation les clients avec des boutiques partenaires, proposons des conseils, des vérifications, des réparations et des logiciels. Lorsque la facture ne désigne pas Innovatech comme vendeur, la boutique reste le vendeur du produit.</p>
            <h3>2. Annonces et traçabilité</h3>
            <p>« Boutique examinée » signifie que la boutique ou l’annonce a été revue. Cela ne signifie pas que l’appareil a été testé physiquement. « Vérifié physiquement » est utilisé seulement lorsqu’un contrôle réel est enregistré. La référence de traçabilité identifie le contrôle, mais ne garantit pas l’absence de toute panne future.</p>
            <h3>3. Prix, commande et paiement</h3>
            <p>Les prix sont en FCFA sauf indication contraire. Le vendeur, le produit, le prix final, la disponibilité, la livraison ou le retrait, la garantie, le paiement et les conditions de retour seront confirmés avant l’acceptation de la commande. Une discussion WhatsApp ne constitue pas automatiquement une commande acceptée. Ne payez pas un numéro personnel sans facture ou confirmation écrite.</p>
            <h3>4. Conseil, vérification et réparation</h3>
            <p>La négociation peut être gratuite lorsque l’offre est clairement indiquée ainsi et que le client confirme être prêt à acheter si la boutique confirme la disponibilité et le prix final. La boutique décide du prix final et aucune réduction n’est garantie. Les frais et le périmètre des autres conseils ou vérifications sont confirmés avant le début du travail. Pour une réparation, le diagnostic, les pièces, le prix, le délai et la garantie éventuelle seront indiqués. Les droits impératifs du consommateur camerounais restent applicables.</p>
            <h3>5. Boutiques et parrainage</h3>
            <p>Les boutiques doivent publier des informations exactes, avoir le droit de vendre les produits et signaler les défauts. Les produits volés, contrefaits ou illégaux sont interdits. Un code de parrainage ne garantit pas un revenu : le code est enregistré avec la demande et une récompense éventuelle dépend d’un achat admissible confirmé avec la boutique. Si une commission de mise en relation est payée à Innovatech ou au parrain, nous ne la présenterons pas comme un « aucun gain » lorsqu’elle est pertinente et aucun supplément caché ne sera ajouté au client.</p>
            <h3>6. Réclamations et données</h3>
            <p>Envoyez votre réclamation à hello@innovatech.cm ou au +237 651 162 373 avec la référence de la commande. Nous expliquerons si le problème relève d’Innovatech, de la boutique ou d’un autre prestataire. Vos données sont traitées selon notre <Link to="/privacy">Politique de confidentialité</Link>. N’envoyez pas de mot de passe, code bancaire, pièce d’identité ou IMEI complet dans un chat public.</p>
            <h3>7. Droit applicable</h3>
            <p>Ces conditions sont destinées à être régies par le droit camerounais. Elles ne suppriment pas les droits obligatoires du consommateur, notamment ceux relatifs à l’information, à la réparation, au remplacement, au remboursement ou au recours lorsque la loi les prévoit.</p>
            <ContactBlock />
          </article>
          <aside className="legal-sidebar">
            <strong>Before launch</strong>
            <p>Replace the contact block with your exact registered business name, physical address, RCCM and NIU if applicable. Have a Cameroon-qualified lawyer or consumer-law adviser review this page before accepting online payments.</p>
            <Link to="/privacy" className="btn btn--secondary">Read Privacy Notice</Link>
            <Link to="/contact" className="btn btn--ghost">Contact Innovatech</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
