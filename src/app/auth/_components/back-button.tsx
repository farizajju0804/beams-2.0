import Link from "next/link";
import type { FC } from "react";

interface BackButtonProps {
  subText?: string; // Optional subtext displayed above or below the link
  href: string;     // URL to navigate when the link is clicked
  label: string;    // Text label for the link
  position: "top" | "bottom"; // Determines the placement style of the component
}

// Functional Component for BackButton
const BackButton: FC<Readonly<BackButtonProps>> = ({ position, subText, href, label }) => {
  return (
    // Wrapper div: applies styling based on the 'position' prop to control layout
    <div className={`${position == "top" ? "mx-0" : "px-3 mx-auto text-center"}`}>
      {/* Optional subtext: displayed as a small text above or below the link */}
      <span className="text-sm text-text text-center">{subText} </span>
      {/* Link element: navigates to the specified href with the provided label */}
      <Link className="text-sm text-brand font-semibold" href={href}>
        {label}
      </Link>
    </div>
  );
};

export default BackButton;
