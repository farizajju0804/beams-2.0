import React from 'react';
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import PublicFooter from "@/components/PublicFooter";
import { SessionProviders } from "../SessionProviders";
import BottomNav from '@/components/BottomNav';
import { SessionValidator } from '@/components/SessionValidator';
import ReferralUpdater from './_components/ReferralUpdater';

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
          {/* <ReferralUpdater/> */}
      {/* <SessionValidator/> */}


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



