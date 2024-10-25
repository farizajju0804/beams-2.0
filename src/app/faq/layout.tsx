import React from 'react';
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import PublicFooter from "@/components/PublicFooter";
import { SessionProviders } from "../SessionProviders";
import BottomNav from '@/components/BottomNav';



export const metadata = {
  title: 'FAQ',
  description: 'Find answers to common questions on our FAQ page. Discover information on our services, troubleshooting, and customer support resources.',
  openGraph: {
    title: 'FAQ',
    description: 'Your go-to resource for answering questions and resolving issues with Beams services.',
    url: 'https://www.beams.world/faq',
    site_name: 'Beams',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ',
    description: 'Explore answers and solutions for Beams services on our FAQ page.',
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



