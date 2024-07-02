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
  backButtonLabel: string;
  backButtonHref: string;
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
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardBody>{children}</CardBody>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;