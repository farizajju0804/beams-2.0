
import { Suspense, type FC } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}


import type { Metadata } from "next";
import { SessionProviders } from "@/app/SessionProviders";

export const metadata: Metadata = {
  title: "Email Verification - Beams",
  description: "Enter the verification code sent to your email to complete your registration on Beams. Confirm your email to activate your account and start learning.",
  keywords: ["email verification", "verify email", "account activation", "Beams registration", "confirmation code"],
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