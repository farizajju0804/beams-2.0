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
    <div className={`${position =="top" ? "mx-0" : "mx-auto"}`}>
      <span className="text-text">{subText} </span>
      <Link className="text-brand font-semibold" href={href}>{label}</Link>

    </div>
  );
};

export default BackButton;