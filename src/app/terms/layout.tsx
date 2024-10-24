import React from 'react';
import Sidebar from "@/components/Sidebar";

import PublicFooter from "@/components/PublicFooter";
import { SessionProviders } from "../SessionProviders";
import BottomNav from '@/components/BottomNav';
import { currentUser } from '@/libs/auth';

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
          {/* <TopNav /> */}
          <div className="flex-grow">
            {children} 
          </div>
          <PublicFooter />
        </div>
      </div>
    </SessionProviders>
  );
}



