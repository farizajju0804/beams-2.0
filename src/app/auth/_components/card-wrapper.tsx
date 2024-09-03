"use client";
import type { FC } from "react";
import BackButton from "@/app/auth/_components/back-button";
import { Header } from "@/app/auth/_components/header";
import Social from "@/app/auth/_components/social";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react"

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonSubText? : string;
  backButtonPosition? : "top" | "bottom";
  backButtonHref?: string;
  showSocial?: boolean;
}

const CardWrapper: FC<Readonly<CardWrapperProps>> = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonSubText,
  backButtonHref,
  backButtonPosition,
  showSocial,
}) => {
  return (
    <Card className="w-full max-w-lg px-4 shadow-none">
      <CardHeader className="mt-2 flex flex-col md:flex-row items-start md:items-center gap-4 w-full py-4 justify-between">
        <Header label={headerLabel} />
        {backButtonLabel && backButtonHref && backButtonPosition == "top" && (
        <BackButton position="top" subText={backButtonSubText} label={backButtonLabel} href={backButtonHref} />
      )
      }
      </CardHeader>
      {showSocial && (
          <Social />
      )}
      <CardBody>{children}</CardBody>
     
      {backButtonLabel && backButtonHref && backButtonPosition == "bottom" &&(
        <CardFooter>
        
        <BackButton position="bottom" subText={backButtonSubText} label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
      )
      }
      
    </Card>
  );
};

export default CardWrapper;