// components/BottomNavigation.tsx
'use client'
import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import FormattedDate from "./FormattedDate";

type BottomNavigationProps = {
  currentDate: Date;
  prevUrl?: string | null;
  nextUrl?: string | null;
};

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentDate, prevUrl, nextUrl }) => {
  const router = useRouter();

  const handlePrevClick = () => {
    if (prevUrl) {
      router.push(prevUrl);
    }
  };

  const handleNextClick = () => {
    if (nextUrl) {
      router.push(nextUrl);
    }
  };

  return (
    <div className="flex justify-between items-center z-[400] p-4 ">
      <Button size="sm" className="bg-grey-1 text-grey-2" startContent={<ArrowLeft2 className="text-grey-2" size="16" /> } onPress={handlePrevClick} isDisabled={!prevUrl}>
       Prev
      </Button>
      <div className="text-gray-1 text-sm"><FormattedDate date={currentDate.toISOString().split('T')[0]} /></div>
      <Button  size="sm" className="bg-grey-1 text-grey-2" endContent={<ArrowRight2 className="text-grey-2" size="16"/>}  onPress={handleNextClick} isDisabled={!nextUrl}>
        Next
      </Button>
    </div>
  );
};

export default BottomNavigation;
