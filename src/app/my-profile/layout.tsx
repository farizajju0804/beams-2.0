import type { Metadata } from "next";
import { Quicksand } from "next/font/google";

import Nav from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Beams Today - Daily Innovation",
  description: "Beams is an innovative next-gen learning platform providing various products for different types of learning in emerging new topics.",
};
const quicksand = Quicksand({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" >
    
      <body className={quicksand.className}>
      <Nav/>
    
        {children}
      </body>
   
    </html>
  
  );
}
