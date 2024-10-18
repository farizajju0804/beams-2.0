import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/others/Navbar";
import { Providers } from "./providers";
const quicksand = Quicksand({ subsets: ["latin"] });
import { SessionProviders } from "./SessionProviders";
export const metadata: Metadata = {
  title: "Beams - Next-gen Learning Platform",
  description: "Beams is an innovative next-gen learning platform providing various products for different types of learning in emerging new topics.",
};
import { GoogleAnalytics } from '@next/third-parties/google'
import ThemeWatcher from "./ThemeWatcher";
import TimeZoneSetter from "@/components/TimeZoneSetter";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
  <SessionProviders>
    <html lang="en">
    {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" /> */}
      <body className={quicksand.className}>

      <GoogleAnalytics gaId="G-W7VPHJY727" />
      <TimeZoneSetter />
      {/* <Navbar/> */}
      <Providers>
        {children}
        </Providers>
      </body>
   
    </html>
    </SessionProviders>
  );
}
