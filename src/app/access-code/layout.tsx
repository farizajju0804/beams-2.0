import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { SessionProviders } from "../SessionProviders";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Invitation Code',
  description: 'Enter your invitation code to get started with Beams. Join our exclusive community.',
  keywords: [
    'access code',
    'invitation code', 
    'join beams',
    'signup code',
    'exclusive access',
    'activation code'
  ],
  authors: [
    {
      name: 'Beams',
      url: 'https://www.beams.world',
    },
  ],
  openGraph: {
    title: 'Invitation Code',
    description: 'Enter your invitation code to join Beams.',
    type: 'website',
    url: 'https://www.beams.world/access-code',
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
      <div className={`bg-background ${quicksand.className}`}>
     
        {children}
      
      </div>
      </SessionProviders>
  );
}
