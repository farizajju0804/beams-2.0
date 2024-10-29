import React from 'react';
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import PublicFooter from "@/components/PublicFooter";
import { SessionProviders } from "../SessionProviders";
import BottomNav from '@/components/BottomNav';


import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'Explore your ranking and compare with others on Beams.',
  keywords: [
    'leaderboard',
    'user ranking',
    'achievements',
    'top users',
    'Beams ranking',
    'user progress'
  ],
  authors: [
    {
      name: 'Beams',
      url: 'https://www.beams.world',
    },
  ],
  openGraph: {
    title: 'Leaderboard',
    description: 'See your ranking on Beams and compare with others.',
    type: 'website',
    url: 'https://www.beams.world/leaderboard',
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



