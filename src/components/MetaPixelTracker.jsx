import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { initMetaPixel, isMetaPixelConfigured, trackMetaEvent } from "../lib/metaPixel";

const CONSENT_KEY = "innovatech-analytics-consent";

export default function MetaPixelTracker() {
  const location = useLocation();
  const { t } = useTranslation();
  const [consent, setConsent] = useState(() => window.localStorage.getItem(CONSENT_KEY) || "");

  if (!isMetaPixelConfigured()) return null;

  useEffect(() => {
    if (consent !== "accepted") return;
    initMetaPixel();
    trackMetaEvent("PageView", {
      page_path: `${location.pathname}${location.search}`,
    });
  }, [consent, location.pathname, location.search]);

  if (consent) return null;

  const chooseConsent = (value) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  return (
    <aside className="meta-consent-banner" aria-label="Analytics consent">
      <p>{t("analyticsConsent.text")}</p>
      <div>
        <button type="button" className="btn btn--primary" onClick={() => chooseConsent("accepted")}>{t("analyticsConsent.accept")}</button>
        <button type="button" className="btn btn--ghost" onClick={() => chooseConsent("declined")}>{t("analyticsConsent.decline")}</button>
      </div>
    </aside>
  );
}
