import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://www.unideals.in";
const APP_URL = "https://app.unideals.in";
const TITLE = "Unideals | Campus Marketplace to Buy & Sell with Students";
const DESCRIPTION =
  "Unideals is the student-only campus marketplace. Buy and sell textbooks, gadgets, cycles and hostel essentials with verified students at your college. Zero commission. Join early access.";
const SOCIALS = [
  "https://instagram.com/unideals",
  "https://x.com/unideals",
  "https://linkedin.com/company/unideals",
  "https://discord.gg/unideals",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Unideals" },
  description: DESCRIPTION,
  applicationName: "Unideals",
  keywords: [
    "Unideals",
    "campus marketplace",
    "college marketplace India",
    "student marketplace",
    "buy and sell on campus",
    "second hand textbooks",
    "used books for college students",
    "hostel essentials",
    "sell old laptop college",
    "student buy sell app",
    "verified students marketplace",
    "zero commission marketplace",
  ],
  authors: [{ name: "Unideals", url: SITE_URL }],
  creator: "Imaginum",
  publisher: "Unideals",
  category: "shopping",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Unideals",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@unideals",
    creator: "@unideals",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: { title: "Unideals", statusBarStyle: "default" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0F" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Structured data (schema.org JSON-LD): tells Google, Bing and AI answer
// engines exactly what Unideals is, who runs it and where the product lives.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Unideals",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-u-blue.png` },
      description: DESCRIPTION,
      sameAs: SOCIALS,
      parentOrganization: { "@type": "Organization", name: "Imaginum", url: "https://imaginumorg.vercel.app" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Unideals",
      alternateName: ["Unideals Campus Marketplace", "UniDeals"],
      description: DESCRIPTION,
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#app` },
      inLanguage: "en-IN",
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Unideals",
      url: APP_URL,
      applicationCategory: "ShoppingApplication",
      operatingSystem: "Web, Android",
      description:
        "A campus-only marketplace where verified college students buy and sell textbooks, electronics, cycles, hostel essentials and event passes, chat with sellers, negotiate offers and meet on campus for pickup.",
      audience: { "@type": "Audience", audienceType: "College and university students in India" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR", description: "Free to join. Zero commission on deals." },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body>
        <script
          type="application/ld+json"
          // Static JSON with "<" escaped: safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
