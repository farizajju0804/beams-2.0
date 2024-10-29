import React from 'react';
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import PublicFooter from "@/components/PublicFooter";
import { SessionProviders } from "../SessionProviders";
import BottomNav from '@/components/BottomNav';
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Beams Facts',
  description: 'Unlock daily facts about future tech, ready to read in under 10 seconds.',
  keywords: [
    'daily tech facts',
    'futuristic technology',
    'quick facts',
    'future insights',
    'technology advancements',
    'daily learning',
  ],
  authors: [
    {
      name: 'Beams',
      url: 'https://www.beams.world',
    },
  ],
  openGraph: {
    title: 'Beams Facts - Futuristic Tech Insights',
    description: 'Get daily doses of tech knowledge in under 10 seconds with Beams Facts!',
    type: 'website',
    url: 'https://www.beams.world/beams-facts',
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
}


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



