import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { SessionProviders } from "../SessionProviders";

const quicksand = Quicksand({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: 'User Information',
  description: 'Update your personal information.',
  keywords: [
    'user profile',
    'account settings',
    'personal information',
    'update profile',
    'user details',
    'account management'
  ],
  authors: [
    {
      name: 'Beams',
      url: 'https://www.beams.world',
    },
  ],
  openGraph: {
    title: 'User Information',
    description: 'Update your personal information.',
    type: 'website',
    url: 'https://www.beams.world/user-info',
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
