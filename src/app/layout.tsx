import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

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
import { SessionValidator } from "@/components/SessionValidator";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
  <SessionProviders>
    <html lang="en">
    <head>
          {/* Inline script for site behaviour */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function() {
                var sbSiteSecret = "25321c10-c173-4498-a856-d07cfb1d6a4a";
                window.sitebehaviourTrackingSecret = sbSiteSecret;
                var scriptElement = document.createElement('script');
                scriptElement.async = true;
                scriptElement.id = "site-behaviour-script-v2";
                scriptElement.src = "https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=" + sbSiteSecret;
                document.head.appendChild(scriptElement);
              })();
              `,
            }}
          />
        </head>
      <body className={quicksand.className}>

      <GoogleAnalytics gaId="G-W7VPHJY727">
        
      </GoogleAnalytics>
      <TimeZoneSetter />
      <SessionValidator/>
     
      {/* <Navbar/> */}
      <Providers>
        {children}
        </Providers>
      </body>
   
    </html>
    </SessionProviders>
  );
}
