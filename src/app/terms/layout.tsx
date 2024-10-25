import React from 'react';
import Sidebar from "@/components/Sidebar";

import PublicFooter from "@/components/PublicFooter";
import { SessionProviders } from "../SessionProviders";
import BottomNav from '@/components/BottomNav';
import { currentUser } from '@/libs/auth';
import PublicNav from '@/components/PublicNav';
import TopNav from '@/components/TopNav';



import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read our terms of service to understand the rules, guidelines, and agreements for using Beams learning platform.",
  openGraph: {
    title: "Terms of Service | Beams",
    description: "Rules and guidelines for using Beams learning platform",
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser()
  return (
    <SessionProviders>
      <div className="relative w-full h-screen overflow-hidden flex">
        {user?.firstName && 
        <div className="h-full">
          <Sidebar />
          <BottomNav />      
        </div>
}
        <div className="flex flex-col flex-grow overflow-auto">
        {user ?  <TopNav/> : <PublicNav/>}
          <div className="flex-grow">
            {children} 
          </div>
          <PublicFooter />
        </div>
      </div>
    </SessionProviders>
  );
}



