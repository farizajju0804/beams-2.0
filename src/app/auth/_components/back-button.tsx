import Link from "next/link";
import type { FC } from "react";
import { Button } from "@nextui-org/react";

interface BackButtonProps {
  subText?: string;
  href: string;
  label: string;
  position : "top" | "bottom";
}

const BackButton: FC<Readonly<BackButtonProps>> = ({position,subText, href, label }) => {
  return (
    <div className={`${position =="top" ? "mx-0" : "px-3 mx-auto text-center"}`}>
      <span className="text-sm text-text text-center">{subText} </span>
      <Link className="text-sm text-brand font-semibold" href={href}>{label}</Link>

    </div>
  );
};

export default BackButton;