"use client";
import { Button } from "@nextui-org/react"; // Import Button from NextUI
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react'; // Import Arrow icons

export const ArrowButton = ({
  direction,
  onClick,
  className,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  className?: string;
}) => {
  return (
    <Button
      onClick={onClick}
      color="default"
      className={`bg-transparent text-black ${className}`}
    >
      {direction === 'left' ? (
        <ArrowLeft2 size="32" variant="Bold" />
      ) : (
        <ArrowRight2 size="32" variant="Bold" />
      )}
    </Button>
  );
};
