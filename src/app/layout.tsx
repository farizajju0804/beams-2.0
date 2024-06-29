import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";


const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beams - Next-gen Learning Platform",
  description: "Beams is an innovative next-gen learning platform providing various products for different types of learning in emerging new topics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
      {/* <Navbar/> */}
        {children}
      </body>
    </html>
  );
}
