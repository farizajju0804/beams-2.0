import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { SessionProviders } from "../SessionProviders";

import PublicFooter from "@/components/PublicFooter";
import Nav from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beams - Next-gen Learning Platform",
  description: "Beams is an innovative next-gen learning platform providing various products for different types of learning in emerging new topics.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
  
   
      <div className={`relative bg-background ${quicksand.className}`}>
         <Nav/>
         <BottomNav /> 
        {children}
          <PublicFooter/>
      </div>
    
  );
}
