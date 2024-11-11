import React from 'react';
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import PublicFooter from "@/components/PublicFooter";
import { SessionProviders } from "../SessionProviders";
import BottomNav from '@/components/BottomNav';
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Beams Today: 2-Minute Tech Insights',
  description: 'Learn about futuristic tech in just 2 minutes. Access audio, text, and video formats for quick, insightful learning.',
  keywords: [
    'tech learning',
    '2-minute insights',
    'futuristic technology',
    'Beams Today',
    'quick tech',
    'audio learning',
    'video learning',
    'text learning'
  ],
  authors: [
    {
      name: 'Beams',
      url: 'https://www.beams.world',
    },
  ],
  openGraph: {
    title: 'Beams Today: 2-Minute Futuristic Tech Insights',
    description: 'Quick learning in audio, text, and video formats about the latest in futuristic technology.',
    type: 'website',
    url: 'https://www.beams.world/beams-today',
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
      <div className="relative w-full h-screen overflow-hidden flex">
        <div className="h-full">
          <Sidebar />
          <BottomNav /> 
     


        </div>
        <div className="flex flex-col flex-grow overflow-auto">
          <TopNav />
          <div className="flex-grow">
            {children} 
          </div>
          <PublicFooter />
        </div>
      </div>
    </SessionProviders>
  );
}



