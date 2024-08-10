"use client";

import Link from "next/link";
import type { FC } from "react";
import { Button } from "@nextui-org/react";

interface BackButtonProps {
  href: string;
  label: string;
}

const BackButton: FC<Readonly<BackButtonProps>> = ({ href, label }) => {
  return (
    <Button size="sm" className="font-normal bg-transparent w-full" >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;