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
      <div className="flex flex-col lg:flex-row min-h-screen w-full items-center">
        <RegisterSide/>
      <div className="w-full lg:w-[50%] md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
            <Step1Form ip={ip} pendingEmail={pendingEmail}  />
            </div>
.          </div>
      </Suspense>
  
  );
};

export default Page;