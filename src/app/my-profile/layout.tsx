import React from 'react';
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import PublicFooter from "@/components/PublicFooter";
import { SessionProviders } from "../SessionProviders";
import BottomNav from '@/components/BottomNav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update Profile',
  description: 'Manage and update your personal information, account security, and profile settings.',
  keywords: [
    'update profile',
    'user profile',
    'account settings',
    'security settings',
    'two-factor authentication',
    'personal information',
    'Beams user account'
  ],
  authors: [
    {
      name: 'Beams',
      url: 'https://www.beams.world',
    },
  ],
  openGraph: {
    title: 'Update Your Profile',
    description: 'Securely update your profile information, email, and password settings with Beams.',
    type: 'website',
    url: 'https://www.beams.world/my-profile',
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



