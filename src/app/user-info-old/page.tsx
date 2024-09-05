import { auth } from "@/auth";
import UserOnboarding from "@/app/auth/_components/user-onboarding";

const Page = async() => {

  const session = await auth()
 
  
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <UserOnboarding sessionData={session} />
    </div>
  );
};

export default Page;