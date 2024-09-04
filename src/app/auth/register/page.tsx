import { checkPendingVerification } from "@/actions/auth/register";
import RegisterPage from "@/app/auth/_components/register-form";
import Step1Form from "@/app/auth/_components/Step1";
import { getClientIp } from "@/utils/getClientIp";
import { Suspense } from "react";
import RegisterSide from "../_components/RegisterSide";

const Page = async() => {
  const ip = getClientIp()
  const pendingEmail:any = await checkPendingVerification(ip);
  return (
    <Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full">
        <RegisterSide/>
      <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
            <Step1Form ip={ip} pendingEmail={pendingEmail}  />
            </div>
          </div>
      </Suspense>
  
  );
};

export default Page;