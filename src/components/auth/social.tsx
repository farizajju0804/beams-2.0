import Image from "next/image";
import { Button } from "@nextui-org/react";
import { FaGoogle } from "react-icons/fa6";
const Social = () => {
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    console.log("Hello All");
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="bordered"
        onClick={() => onClick("google")}
      >
       <FaGoogle className="h-5 w-5"/>
      </Button>
     
    </div>
  );
};

export default Social;