import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SessionProviders } from "./SessionProviders";
import TimeZoneSetter from "@/components/TimeZoneSetter";
import { SessionValidator } from "@/components/SessionValidator";
import Script from "next/script";
import OnlineStatus from "@/components/OnlineStatus";

// Import the Quicksand font from Google fonts
const quicksand = Quicksand({ subsets: ["latin"] });

// Metadata for the application
export const metadata: Metadata = {
  title: {
    default: "Beams - Next-gen Learning Platform",
    template: "%s | Beams" // Dynamic title template
  },
  description: "Beams is an innovative next-gen learning platform providing various products for different types of learning in emerging new topics.",
  keywords: ["learning platform", "online education", "next-gen learning", "educational technology", "e-learning"],
  authors: [{ name: "Beams" }],
  creator: "Beams",
  publisher: "Beams",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.beams.world'), // Base URL for the site
  alternates: {
    canonical: '/', // Canonical URL
    languages: {
      'en-US': '/en-us',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.beams.world',
    title: 'Beams - Next-gen Learning Platform',
    description: 'Beams is an innovative next-gen learning platform providing various products for different types of learning in emerging new topics.',
    siteName: 'Beams',
    images: [
      {
        url: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1724853253/Beams%20today/AI%20Headphones/ai-headphones-thumbnail-v7zzwd-66cf2bf769602_pj7aka.webp', // Image for Open Graph
        width: 1200,
        height: 630,
        alt: 'Beams - Next-gen Learning Platform',
      },
    ],
  },
  // Uncomment and customize the Twitter metadata if needed
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Beams - Next-gen Learning Platform',
  //   description: 'Innovative next-gen learning platform for emerging topics',
  //   creator: '@yourhandle',
  //   images: ['/images/twitter-image.jpg'],
  // },
  robots: {
    index: true, // Allow search engine indexing
    follow: true, // Follow links
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Root layout component that wraps the application with essential providers and metadata
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSecret = process.env.NEXT_PUBLIC_SITE_BEHAVIOUR_SECRET;
  // JSON-LD structured data for SEO (website schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Beams',
    description: 'Next-gen Learning Platform',
    url: 'https://www.beams.world',
  };

  // Organization schema for structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Beams',
    url: 'https://www.beams.world',
    logo: 'https://www.beams.world/images/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@beams.world',
      contactType: 'customer support'
    }
  };

  return (
    <SessionProviders>
      <html lang="en" className="scroll-smooth">
        <head>
          {/* Favicon and Apple touch icon */}
          <link rel="icon" href="/favicon.ico" sizes="any" />
          {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
          {/* Preconnects for Google Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

          {/* Insert JSON-LD schemas for website and organization */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema)
            }}
          />
        </head>
        
        <body className={quicksand.className}>
          {/* Initialize timezone and session validation components */}
          <TimeZoneSetter />
          <SessionValidator/>
          <OnlineStatus/>
          {/* Main Providers for application state and context */}
          <Providers>
            {children}
          </Providers>

          {/* Site behavior tracking script with embedded secret */}
          <Script id="site-behaviour" type="text/javascript">
            {`
             
           (
              function() {
                 var sbSiteSecret = "${siteSecret}";
                window.sitebehaviourTrackingSecret = sbSiteSecret;
                var scriptElement = document.createElement('script');
                scriptElement.async = true;
                scriptElement.id = "site-behaviour-script-v2";
                scriptElement.src = "https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=" + sbSiteSecret;
                document.head.appendChild(scriptElement); 
              }
             )()
            `}
          </Script>
        </body>
      </html>
    </SessionProviders>
  );
}
