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
import Script from "next/script";
// import { GoogleAnalyticsUserTracker } from "@/components/GoogleAnalyticsUserTracker";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
  <SessionProviders>
    <html lang="en">
      <body className={quicksand.className}>

      {/* <GoogleAnalytics gaId="G-W7VPHJY727">
        
      </GoogleAnalytics> */}
      {/* <GoogleAnalyticsUserTracker /> */}
      <TimeZoneSetter />
      <SessionValidator/>
     
      {/* <Navbar/> */}
      <Providers>
        {children}
        </Providers>
        <Script id="site-behaviour" type="text/javascript">
        {`
      (
        function() {
          var sbSiteSecret = "53621595-e2cc-41a3-8cac-e425bc749a9b";
          window.sitebehaviourTrackingSecret = sbSiteSecret;
          var scriptElement = document.createElement('script');
          scriptElement.async = true;
          scriptElement.id = "site-behaviour-script-v2";
          scriptElement.src = "https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=" + sbSiteSecret;
          document.head.appendChild(scriptElement); 
        }
      )()
      `}
</Script>
      </body>
   
    </html>
    </SessionProviders>
  );
}
