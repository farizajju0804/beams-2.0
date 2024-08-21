import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import Nav from "@/components/Navbar";


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
         <div className="w-full max-w-full overflow-x-hidden">
        <Nav />
        {children}
        </div>
  
  );
}
