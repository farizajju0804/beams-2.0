import type { Metadata } from "next";

import Nav from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Beams Today - Daily Innovation",
  description: "Beams is an innovative next-gen learning platform providing various products for different types of learning in emerging new topics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
    
      <body>
      <Nav/>
    
        {children}
      </body>
   
    </html>
  
  );
}
