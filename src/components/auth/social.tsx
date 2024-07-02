import { Button } from "@nextui-org/react";
import { FaGoogle } from "react-icons/fa6";
import { signIn } from "next-auth/react"; // Import signIn from next-auth/react
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const Social = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="bordered"
        onClick={() => signIn("google", { redirectTo: DEFAULT_LOGIN_REDIRECT })}
      >
        Continue With
        <FaGoogle className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Social;
