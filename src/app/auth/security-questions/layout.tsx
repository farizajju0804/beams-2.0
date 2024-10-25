
import { Suspense, type FC } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}


import type { Metadata } from "next";
import { SessionProviders } from "@/app/SessionProviders";

export const metadata: Metadata = {
  title: "Security Questions",
  description: "Set up security questions to add an extra layer of protection to your Beams account. Choose questions only you can answer to keep your account secure.",
  keywords: ["security questions", "account protection", "Beams security", "enhanced security", "account safety"],
  authors: [{ name: "Beams" }],
  creator: "Beams",
  publisher: "Beams",
  robots: {
    index: false,
    follow: false,
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