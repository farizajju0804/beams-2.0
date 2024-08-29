import { checkPendingVerification } from "@/actions/auth/register";
import RegisterPage from "@/components/auth/register-form";
import Step1Form from "@/components/auth/Step1";
import { getClientIp } from "@/utils/getClientIp";
import { Suspense } from "react";

const Page = async() => {
  const ip = getClientIp()
  const pendingEmail:any = await checkPendingVerification(ip);
  return (
    <Suspense>
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden ">
        <div className="flex items-center justify-center md:justify-center px-4 md:px-12 w-full ">
          <div className="w-full flex items-center justify-center max-w-md md:max-w-lg">
            <Step1Form ip={ip} pendingEmail={pendingEmail}  />
          </div>
        </div>
        
      </div>
      </Suspense>
  
  );
};

export default Page;