"use client";
import type { FC } from "react";
import BackButton from "@/components/auth/back-button";
import { Header } from "@/components/auth/header";
import Social from "@/components/auth/social";
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
  backButtonHref?: string;
  showSocial?: boolean;
}

const CardWrapper: FC<Readonly<CardWrapperProps>> = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}) => {
  return (
    <Card className="w-full max-w-md px-2 md:px-2 bg-background rounded-2xl m-4 shadow-md">
      <CardHeader className="mt-2">
        <Header label={headerLabel} />
      </CardHeader>
      <CardBody>{children}</CardBody>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      {backButtonLabel && backButtonHref && (
        <CardFooter>
        
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
      )
      }
      
    </Card>
  );
};

export default CardWrapper;