import React from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";

const UPDATED = "21 October 2026";

export default function Privacy() {
  return (
    <main>
      <PageHero image="/images/hero-services.jpg" eyebrow="Legal information" title="Privacy Notice" subtitle="How Innovatech handles names, phone numbers, account data and product requests." />
      <section className="section legal-section">
        <div className="container legal-layout">
          <article className="legal-document">
            <div className="legal-meta">Last updated: {UPDATED} · English version</div>
            <p className="legal-lead">This notice explains the personal information Innovatech may receive through this website, Supabase account features, forms and WhatsApp conversations. It should be read with our <Link to="/terms">Terms of Service</Link>.</p>

            <h2>1. Who controls the data</h2>
            <p>Innovatech Engineering Solutions, Yaounde, Cameroon, is responsible for the personal information it collects for its own services. Contact us at <a href="mailto:hello@innovatech.cm">hello@innovatech.cm</a> or WhatsApp +237 651 162 373. Where a partner store or WhatsApp processes data for its own purpose, that organisation may also be responsible under its own notice.</p>

            <h2>2. What we may collect</h2>
            <ul>
              <li>Contact details: name, phone/WhatsApp number and email.</li>
              <li>Request details: city, product or repair information, seller name, links, photos and messages you choose to send.</li>
              <li>Account details: email, password authentication data, name, phone and referral code.</li>
              <li>Service records: consultation status, agreed fee, traceability reference, repair or software project information and support history.</li>
              <li>Technical information supplied by hosting, authentication and security services, such as device/browser information and logs.</li>
            </ul>
            <p>Do not send passwords, Mobile Money PINs, identity documents, bank-card credentials or a full IMEI through a public form or WhatsApp chat. If a legal or service requirement ever makes sensitive data necessary, we will explain why and request it through an appropriate channel.</p>

            <h2>3. Why we use it</h2>
            <ul>
              <li>To answer questions, open a WhatsApp conversation and provide requested consulting, repair, software or marketplace support.</li>
              <li>To create and secure an optional account and connect a referral code to the correct person.</li>
              <li>To review store and product listings, maintain traceability and handle complaints, refunds or disputes.</li>
              <li>To send service messages about a request, order, account or referral reward.</li>
              <li>To protect the website, prevent fraud and meet legal or accounting obligations.</li>
            </ul>
            <p>We do not sell personal information. We will not add you to promotional messages without a lawful basis and a way to stop them.</p>

            <h2>4. Lawful basis and consent</h2>
            <p>We process information only for a stated service purpose, with your consent where required, to perform a requested contract or pre-contract step, to comply with a legal obligation, or to protect our legitimate service and security interests where permitted. You may withdraw consent for optional processing; withdrawal does not undo processing already carried out lawfully.</p>

            <h2>5. Sharing and service providers</h2>
            <p>We share only what is needed with the named partner store, our authorised team members and service providers that help us host the website, authenticate accounts, store requests, send email or open WhatsApp. The current website uses Supabase for database/authentication and Vercel for hosting. WhatsApp and other providers process information under their own terms and privacy notices. We may disclose information where required by a lawful request, to protect people, or to investigate fraud.</p>

            <h2>6. Retention and security</h2>
            <p>We keep information only for as long as necessary for the stated purpose, a live customer relationship, accounting, dispute handling or a legal requirement. We use access controls, Row Level Security, limited staff access and reasonable technical measures. No online service can promise absolute security; please contact us promptly if you believe your account or conversation has been exposed.</p>

            <h2>7. Your choices and rights</h2>
            <p>Subject to applicable law and lawful exceptions, you may ask us to inform you about, access, correct, update, delete or limit our use of your personal information, object to optional processing, withdraw consent, or receive clarification about a request. Send the request to <a href="mailto:hello@innovatech.cm">hello@innovatech.cm</a> and include enough information for us to identify the request without sending a password or secret code. We may need to verify your identity before acting.</p>

            <h2>8. Children</h2>
            <p>The website is not designed to collect personal data from children without the consent or involvement of a parent or legal representative. If you are under 18, ask a parent or legal representative to help before opening an account or requesting a paid service.</p>

            <h2>9. Cookies and local storage</h2>
            <p>We use essential browser storage for language preference, referral-code continuity and basic site operation. We do not use those features to request a password or Mobile Money PIN. If we introduce non-essential analytics or advertising cookies, we will update this notice and provide any consent or control required.</p>

            <h2>10. International processing</h2>
            <p>Some hosting, authentication, email or messaging providers may process data outside Cameroon. We will use providers and safeguards appropriate to the applicable Cameroon requirements and will update this notice when the providers or processing purposes materially change.</p>

            <h2>11. Changes and contact</h2>
            <p>We may update this notice when our services, providers or legal obligations change. The current version is published on this page. For questions or privacy requests:</p>
            <p className="legal-contact"><strong>Innovatech Engineering Solutions</strong><br />Yaounde, Cameroon<br />WhatsApp: +237 651 162 373<br />Email: <a href="mailto:hello@innovatech.cm">hello@innovatech.cm</a></p>

            <hr />
            <div className="legal-meta">Version française</div>
            <h2>Politique de confidentialité</h2>
            <p>Innovatech Engineering Solutions traite les données nécessaires pour répondre à vos demandes, gérer les comptes, les parrainages, les consultations, les annonces et les réclamations. Nous pouvons recevoir votre nom, téléphone/WhatsApp, email, ville, informations sur le produit ou la réparation, liens, photos et messages que vous choisissez d’envoyer.</p>
            <p>Nous n’achetons ni ne vendons vos données personnelles. Nous pouvons les communiquer uniquement à l’équipe autorisée, à la boutique concernée et aux prestataires nécessaires à l’hébergement, l’authentification, la messagerie et la sécurité, notamment Supabase, Vercel et WhatsApp. Ces prestataires appliquent aussi leurs propres règles.</p>
            <p>Nous conservons les données pendant la durée nécessaire au service, à la comptabilité, au traitement des litiges ou à une obligation légale. Vous pouvez demander l’accès, la rectification, la mise à jour, la suppression ou la limitation du traitement, retirer un consentement facultatif ou vous opposer à un usage facultatif, sous réserve de la loi applicable. Écrivez à hello@innovatech.cm. Nous pouvons vérifier votre identité avant d’agir.</p>
            <p>Ne transmettez jamais de mot de passe, code Mobile Money, données bancaires, pièce d’identité ou IMEI complet dans un formulaire public ou un chat WhatsApp. Les mineurs doivent obtenir l’aide et le consentement d’un parent ou représentant légal avant de créer un compte ou demander un service payant.</p>
            <p>Pour les coordonnées complètes et les règles de nos services, consultez les <Link to="/terms">Conditions générales de service</Link>.</p>
          </article>
          <aside className="legal-sidebar">
            <strong>Your data choices</strong>
            <p>For access, correction, deletion, consent withdrawal or a privacy question, email hello@innovatech.cm. Please do not include passwords, PINs or identity documents.</p>
            <Link to="/terms" className="btn btn--secondary">Read Terms of Service</Link>
            <Link to="/contact" className="btn btn--ghost">Contact Innovatech</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
