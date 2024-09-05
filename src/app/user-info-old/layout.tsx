import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { SessionProviders } from "../SessionProviders";

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
  
    <SessionProviders>
      <div className={`bg-background ${quicksand.className}`}>
     
        {children}
      
      </div>
      </SessionProviders>
  );
}
