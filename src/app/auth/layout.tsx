import AuthNav from "@/components/AuthNav";
import { Suspense, type FC } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: FC<Readonly<AuthLayoutProps>> = ({ children }) => {
  return (
    <Suspense>
      
    <div className="min-h-screen w-full flex flex-col max-w-full justify-start items-center lg:justify-center">
      {children}
    </div>
    </Suspense>
  );
};

export default AuthLayout;