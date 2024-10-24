import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";
const quicksand = Quicksand({ subsets: ["latin"] });
import { SessionProviders } from "./SessionProviders";

import TimeZoneSetter from "@/components/TimeZoneSetter";
import { SessionValidator } from "@/components/SessionValidator";
import Script from "next/script";

export  const metadata: Metadata = {
  title: {
    default: "Beams - Next-gen Learning Platform",
    template: "%s | Beams"
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
  metadataBase: new URL('https://www.beams.world'), // Replace with your actual domain
  alternates: {
    canonical: '/',
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
        url: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1724853253/Beams%20today/AI%20Headphones/ai-headphones-thumbnail-v7zzwd-66cf2bf769602_pj7aka.webp', // Add your OG image
        width: 1200,
        height: 630,
        alt: 'Beams - Next-gen Learning Platform',
      },
    ],
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Beams - Next-gen Learning Platform',
  //   description: 'Innovative next-gen learning platform for emerging topics',
  //   creator: '@yourhandle', // Add your Twitter handle
  //   images: ['/images/twitter-image.jpg'], // Add your Twitter card image
  // },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Beams',
    description: 'Next-gen Learning Platform',
    url: 'https://www.beams.world',
  };

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
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
       
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          
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

     {/* <GoogleAnalytics gaId="G-W7VPHJY727"> */}

      <TimeZoneSetter />
      <SessionValidator/>
     
   
      <Providers>
        {children}
        </Providers>
        <Script id="site-behaviour" type="text/javascript">
        {`
      (
        function() {
          var sbSiteSecret = "53621595-e2cc-41a3-8cac-e425bc749a9b";
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
