import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { SessionProviders } from "../SessionProviders";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { currentUser } from "@/libs/auth";
import Nav from "@/components/Navbar";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beams - Next-gen Learning Platform",
  description: "Beams is an innovative next-gen learning platform providing various products for different types of learning in emerging new topics.",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser()

  return (
  
   
      <div className={`relative bg-background ${quicksand.className}`}>
         {user ? <Nav/> : <PublicNav/>}
        {children}
          <PublicFooter/>
      </div>
    
  );
}
