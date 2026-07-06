"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
} from "@/lib/cookie-consent";

function readAnalyticsConsent() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) === "accepted";
}

function updateGoogleConsent(hasConsent: boolean) {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

  const consentStatus = hasConsent ? "granted" : "denied";

  window.gtag("consent", "update", {
    ad_personalization: consentStatus,
    ad_storage: consentStatus,
    ad_user_data: consentStatus,
    analytics_storage: consentStatus,
  });

  window.dataLayer.push({
    event: hasConsent ? "cookie_consent_accepted" : "cookie_consent_rejected",
    analytics_storage: consentStatus,
  });
}

export function GoogleMeasurement() {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const gtmContainerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID?.trim();
  const shouldLoadDirectGa = Boolean(gaMeasurementId);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    function updateConsent() {
      setHasConsent(readAnalyticsConsent());
    }

    updateConsent();
    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, updateConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, updateConsent);
    };
  }, []);

  useEffect(() => {
    updateGoogleConsent(hasConsent);
  }, [hasConsent]);

  if (!gtmContainerId && !shouldLoadDirectGa) {
    return null;
  }

  return (
    <>
      <Script
        id="google-consent-default"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_personalization: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted'
            });
          `,
        }}
      />

      {gtmContainerId ? (
        <>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmContainerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmContainerId}');
              `,
            }}
          />
        </>
      ) : null}

      {hasConsent && shouldLoadDirectGa ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { send_page_view: true });
              `,
            }}
          />
        </>
      ) : null}
    </>
  );
}
