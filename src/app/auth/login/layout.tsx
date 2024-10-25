
import { Suspense, type FC } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}


import type { Metadata } from "next";
import { SessionProviders } from "@/app/SessionProviders";

export const metadata: Metadata = {
  title: "Login",
  description: "Access your Beams account. Log in to explore our next-gen learning platform and continue your educational journey.",
  keywords: ["login", "Beams", "next-gen learning", "education platform", "online learning"],
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