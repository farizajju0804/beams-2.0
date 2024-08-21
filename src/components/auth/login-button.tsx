"use client";
import {Button} from "@nextui-org/button";
import { useRouter } from "next/navigation";
// import LoginForm from "~/components/auth/login-form";

// import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

interface LoginButtonProps {
  asChild?: boolean;
}

export const LoginButton = ({
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };
  const onClickRegister = () => {
    router.push("/auth/register");
  };


  return (
    <div className="flex gap-4 flex-col md:flex-row items-center w-full justify-center px-10">
        <Button variant="bordered" size="lg" color="primary" className="md:w-40 w-full text-primary text-lg font-medium" onClick={onClick}>Login</Button>
        <Button color="primary" size="lg" className="md:w-40 w-full text-white text-lg  font-medium" onClick={onClickRegister}>Sign Up</Button>
    </div>
  );
};