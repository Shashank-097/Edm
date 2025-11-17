import "./globals.css";
import type { ReactNode } from "react";
import ClientLayout from "./ClientLayout";
import Script from "next/script";

export const metadata = {
  title: "Era of Digital Marketing",
  description:
    "Era of Digital Marketing combines creative thinking with technical precision to grow brands through data-driven strategy, innovation, and partnership.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />

        {/* ✅ Custom favicon with versioning (to bypass browser cache) */}
        <link rel="icon" type="image/png" href="/edm-logo.png?v=2" />
        <link rel="shortcut icon" href="/edm-logo.png?v=2" />
        <link rel="apple-touch-icon" href="/edm-logo.png?v=2" />
        <meta name="theme-color" content="#ffffff" />

        {/* ✅ Structured data for Google (helps show your logo in search results) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "EDM (Era of Digital Marketing)",
              url: "https://www.eraofdigitalmarketing.com",
              logo: "https://www.eraofdigitalmarketing.com/edm-logo.png",
            }),
          }}
        />
      </head>

      <body>
        <ClientLayout>{children}</ClientLayout>

        {/* ✅ Google Analytics tag */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-84KBY4VKDW"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-84KBY4VKDW');
          `}
        </Script>
      </body>
    </html>
  );
}
