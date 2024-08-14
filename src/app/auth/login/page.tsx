
import type { FC } from "react";
import LoginForm from "@/components/auth/login-form";
import { Suspense } from 'react';

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = ({}) => {

  return (
    <Suspense>
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden ">
        <div className="flex items-center justify-center md:justify-center px-4 md:px-12 w-full ">
          <div className="w-full flex items-center justify-center max-w-md md:max-w-lg">
            <LoginForm  />
          </div>
        </div>
       
      </div>
    </Suspense>
  );
};

export default LoginPage;
