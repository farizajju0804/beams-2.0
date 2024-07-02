"use client";
import {Button} from "@nextui-org/button";
import { useRouter } from "next/navigation";
// import LoginForm from "~/components/auth/login-form";

// import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

interface LoginButtonProps {
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return (
    //   <Dialog>
    //     <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
    //     <DialogContent className="p-0 w-auto bg-transparent border-none">
    //       <LoginForm />
    //     </DialogContent>
    //   </Dialog>
    <span className="">Todo model</span>
    );
  }

  return (
    <span className="cursor-pointer">
        <Button onClick={onClick}>Login</Button>
    </span>
  );
};