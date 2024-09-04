
import type { FC } from "react";
import LoginForm from "@/app/auth/_components/login-form";
import { Suspense } from 'react';
import { headers } from 'next/headers'
import { getClientIp } from "@/utils/getClientIp";
import { checkPendingVerification } from "@/actions/auth/register";
import LoginSide from "../_components/LoginSide";
interface LoginPageProps {}

 

const LoginPage: FC<LoginPageProps> = async({}) => {
  const ip = getClientIp()
  const pendingEmail:any = await checkPendingVerification(ip);
  return (
    <Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full">
            <LoginSide show={false}/>
            <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
            <LoginForm ip={ip} pendingEmail={pendingEmail} />
            </div>
            
          </div>
  
    </Suspense>
  );
};

export default LoginPage;
