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
  title: "Contact Us",
  description: "Get in touch with us for any questions, support, or inquiries about Beams learning platform.",
  openGraph: {
    title: "Contact Us | Beams",
    description: "Reach out to us with your questions or concerns regarding Beams learning platform.",
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



