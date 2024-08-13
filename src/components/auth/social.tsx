import { Button } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";

const Social = () => {
  const user = useCurrentUser();

  const handleSocialSignIn = () => {
    let redirectTo = "/beams-today"; // Default redirect

    if (user) {
      if (!user.userFormCompleted) {
        redirectTo = "/user-info";
      } else if (!user.onBoardingCompleted) {
        redirectTo = "/onboarding";
      }
    }

    signIn("google", { callbackUrl: redirectTo });
  };

  return (
    <div className="flex items-center flex-col justify-center w-full gap-x-2">
      <p className="text-xs mb-2 text-grey-2">Continue With</p>
      <Button
        size="lg"
        className="bg-transparent"
        isIconOnly
        onClick={handleSocialSignIn}
        startContent={<FcGoogle className="h-8 w-8" />}
      >
      </Button>
    </div>
  );
};

export default Social;
