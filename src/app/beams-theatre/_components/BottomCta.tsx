// components/BottomNavigation.tsx
'use client'
import React from "react";
import { Button } from "@nextui-org/react";
import { Video, VideoPlay } from "iconsax-react";




const BottomCta: React.FC = () => {


  return (
    <div className="fixed lg:hidden w-full bg-background bottom-0 right-0 border-t border-grey-1 flex justify-center items-center z-[400] p-4 ">
      <Button  color="primary" className="text-white w-full font-semibold text-lg " startContent={<VideoPlay variant='Bold' className="text-white" size="20" /> } >
       Start Course
      </Button>
    </div>
  );
};

export default BottomCta;
