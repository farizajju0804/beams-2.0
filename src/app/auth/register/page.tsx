import { RegisterForm } from "@/components/auth/register-form";

const RegisterPage = () => {
  return (
   
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden my-4">
        <div className="flex items-center justify-center md:justify-center px-4 md:px-12 w-full ">
          <div className="w-full flex items-center justify-center max-w-md md:max-w-lg">
            <RegisterForm  />
          </div>
        </div>
        
      </div>
  
  );
};

export default RegisterPage;