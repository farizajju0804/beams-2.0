import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { SessionProviders } from "../SessionProviders";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Welcome to Beams',
  description: 'Discover the powerful features and benefits of Beams. Learn how our platform can help you connect and grow.',
  keywords: [
    'product onboarding',
    'getting started',
    'welcome',
    'product features',
    'product benefits',
    'user guide',
    'welcome tour',
    'beams platform'
  ],
  authors: [
    {
      name: 'Beams',
      url: 'https://www.beams.world',
    },
  ],
  openGraph: {
    title: 'Welcome to Beams',
    description: 'Discover how Beams can transform your experience.',
    type: 'website',
    url: 'https://www.beams.world/onboarding',
    siteName: 'Beams',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
    },
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SessionProviders>
      <div className={quicksand.className}>
     
        {children}
      
      </div>
      </SessionProviders>
      
 

  );
}
