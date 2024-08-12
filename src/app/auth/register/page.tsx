import RegisterPage from "@/components/auth/register-form";

const Page = () => {
  return (
   
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden ">
        <div className="flex items-center justify-center md:justify-center px-4 md:px-12 w-full ">
          <div className="w-full flex items-center justify-center max-w-md md:max-w-lg">
            <RegisterPage  />
          </div>
        </div>
        
      </div>
  
  );
};

export default Page;