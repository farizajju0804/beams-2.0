import { Suspense, type FC } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: FC<Readonly<AuthLayoutProps>> = ({ children }) => {
  return (
    <Suspense>
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      {children}
    </div>
    </Suspense>
  );
};

export default AuthLayout;