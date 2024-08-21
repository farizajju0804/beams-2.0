
import type { FC } from "react";
import LoginForm from "@/components/auth/login-form";
import { Suspense } from 'react';
import { headers } from 'next/headers'
import { getClientIp } from "@/utils/getClientIp";
interface LoginPageProps {}

 

const LoginPage: FC<LoginPageProps> = ({}) => {
  const ip = getClientIp()
  return (
    <Suspense>
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden ">
        <div className="flex items-center justify-center md:justify-center px-4 md:px-12 w-full ">
          <div className="w-full flex items-center justify-center max-w-md md:max-w-lg">
            <LoginForm ip={ip} />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default LoginPage;
