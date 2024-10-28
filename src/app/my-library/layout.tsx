import React from 'react';
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import PublicFooter from "@/components/PublicFooter";
import { SessionProviders } from "../SessionProviders";
import BottomNav from '@/components/BottomNav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Library',
  description: 'Access and manage your favorite items and personal notes in one place.',
  keywords: [
    'my library',
    'favorites',
    'notes',
    'delete items',
    'manage library',
    'user content',
    'saved items'
  ],
  authors: [
    {
      name: 'Beams',
      url: 'https://www.beams.world',
    },
  ],
  openGraph: {
    title: 'My Library - Favorites and Notes',
    description: 'View, organize, and manage your saved items, including favorites and personal notes.',
    type: 'website',
    url: 'https://www.beams.world/my-library',
    siteName: 'Beams',
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



