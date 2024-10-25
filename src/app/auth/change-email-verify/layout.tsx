
import { Suspense, type FC } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}


import type { Metadata } from "next";
import { SessionProviders } from "@/app/SessionProviders";

export const metadata: Metadata = {
  title: "Verify New Email",
  description: "Confirm your new email address to complete the update and stay connected with Beams' next-gen learning platform.",
  keywords: ["verify email", "email verification", "change email", "Beams", "account security"],
  authors: [{ name: "Beams" }],
  creator: "Beams",
  publisher: "Beams",
  robots: {
    index: true,
    follow: true,
  },
};



const AuthLayout: FC<Readonly<AuthLayoutProps>> = ({ children }) => {
  return (
    <SessionProviders>
    <Suspense>
      
    <div className="min-h-screen w-full flex flex-col max-w-full justify-start items-center lg:justify-center">
      {children}
    </div>
    </Suspense>
    </SessionProviders>
  );
};

export default AuthLayout;