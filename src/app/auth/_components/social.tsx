'use client'
import { Button } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const Social = () => {

 
  const handleSocialSignIn = () => {
  

    signIn("google", { redirectTo : DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div className="flex items-center flex-col justify-center py-4 px-2 w-full">
      <Button
        size="lg"
        className="w-full bg-transparent font-medium text-text"
        onClick={handleSocialSignIn}
        variant="bordered"
        startContent={<FcGoogle className="h-8 w-8" />}
      >
        Continue With Google
      </Button>
    </div>
  );
};

export default Social;
