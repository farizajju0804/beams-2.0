'use client'
import BackButton from "@/app/auth/_components/back-button";
import { Header } from "@/app/auth/_components/header";
import { Card, CardFooter, CardHeader } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export const ErrorCard = () => {
  const searchParams = useSearchParams(); // Hook to get query parameters from the URL
  const errorParam = searchParams.get("error"); // Get the 'error' query parameter
  const [error, setError] = useState<string | undefined>();

  // Update the error state based on the query parameter
  useEffect(() => {
    if (errorParam === "AccessDenied") {
      setError("Your Account is Banned");
    } else {
      setError("An unexpected error occurred.");
    }
  }, [errorParam]);

  return (
    <div className="m-auto">
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <h1 className="font-poppins text-2xl mx-auto font-semibold text-center">{error || "Error"}</h1>
        {/* <Header label= /> */}
      </CardHeader>
      <CardFooter>
        <BackButton position="bottom" label="Back to login" href="/auth/login" />
      </CardFooter>
    </Card>
    </div>
  );
};
