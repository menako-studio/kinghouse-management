import Script from "next/script"
import { GA_MEASUREMENT_ID, GTM_ID } from "@/lib/analytics"

/**
 * GoogleAnalytics Component
 * Injects Google Tag Manager and Google Analytics 4 tracking scripts.
 *
 * Performance: the consent stub (tiny inline) runs afterInteractive so `window.gtag`/`dataLayer`
 * exist immediately and early events are queued. The heavy third-party bundles (~300KB)
 * load with `lazyOnload` (browser idle after `load`) so they never compete with LCP/TBT.
 */
export function GoogleAnalytics() {
  return (
    <>
      {/* 0. Google Consent Mode v2 Default + gtag queue bootstrap (runs early, ~0.3KB) */}
      <Script
        id="google-consent-mode-v2"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'ad_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted'
            });
            ${
              GA_MEASUREMENT_ID
                ? `gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: false
            });`
                : ""
            }
          `,
        }}
      />

      {/* 1. Google Tag Manager (Script) */}
      {GTM_ID && (
        <Script
          id="google-tag-manager"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      )}

      {/* 2. Google Analytics 4 (gtag.js) — queue already bootstrapped above */}
      {GA_MEASUREMENT_ID && (
        <Script
          id="google-analytics-src"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
      )}

      {/* 3. Google Tag Manager (noscript fallback for non-JS crawlers) */}
      {GTM_ID && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      )}
    </>
  )
}

