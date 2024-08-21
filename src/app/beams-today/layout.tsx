import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import Nav from "@/components/Navbar";
import { Providers } from "../providers";


const quicksand = Quicksand({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Beams Today - Daily Innovation",
  description: "Beams is an innovative next-gen learning platform providing various products for different types of learning in emerging new topics.",
};
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <Providers>
      
    
      <body className={`overflow-x-hidden  ${quicksand.className}`}>
      
        <Nav />
        {children}
     
    
      </body>
      </Providers>
    </html>
  
  );
}
