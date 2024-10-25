
import { Suspense, type FC } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}


import type { Metadata } from "next";
import { SessionProviders } from "@/app/SessionProviders";

export const metadata: Metadata = {
  title: "Reset Password - New Password",
  description: "Create a new password to securely reset your Beams account. Finalize your account recovery to resume learning on our platform.",
  keywords: ["reset password", "new password", "Beams account recovery", "secure password reset", "account security"],
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