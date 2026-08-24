import Script from "next/script";

/**
 * GA4 + Meta Pixel. IDs come from env; the snippets only load when a
 * real-looking ID is present, so placeholder builds ship zero third-party
 * requests (and Lighthouse stays honest).
 */
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "G-XXXXXXXXXX";
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "000000000000000";

const ga4Live = /^G-[A-Z0-9]+$/.test(GA4_ID) && !GA4_ID.includes("X");
const pixelLive = /^\d{6,}$/.test(PIXEL_ID) && !/^0+$/.test(PIXEL_ID);

export default function Analytics() {
  return (
    <>
      {ga4Live && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_ID}');`}
          </Script>
        </>
      )}
      {pixelLive && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
