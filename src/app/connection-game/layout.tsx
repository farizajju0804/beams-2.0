import React from 'react';
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import PublicFooter from "@/components/PublicFooter";
import { SessionProviders } from "../SessionProviders";
import BottomNav from '@/components/BottomNav';
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Beams Connect: 1-Minute Tech Puzzle Game',
  description: 'Engage in a 1-minute image-based connection game. Solve puzzles and uncover answers related to technology and knowledge.',
  keywords: [
    'tech puzzle game',
    '1-minute challenge',
    'image-based game',
    'Beams Connection',
    'technology trivia',
    'knowledge game',
    'quick puzzles',
    'interactive learning'
  ],
  authors: [
    {
      name: 'Beams',
      url: 'https://www.beams.world',
    },
  ],
  openGraph: {
    title: 'Beams Connection: 1-Minute Tech Puzzle Game',
    description: 'Solve quick, engaging image-based puzzles in 1 minute and expand your knowledge of technology.',
    type: 'website',
    url: 'https://www.beams.world/connection-game',
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



