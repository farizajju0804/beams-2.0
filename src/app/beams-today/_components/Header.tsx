import Image from "next/image";
import React from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

const Header = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
     <div className="w-full pl-6 md:pl-8">
      <Breadcrumbs
        pageClassName="text-text"
        linkClassName="text-grey-2"
        items={[
          { href: "/", name:"Home" },
          { name: "Beams Today" },
        ]}
      />
      </div>
   
    {/* <div className="w-full">
     
   
    <div className="flex gap-1 flex-col justify-center items-center py-2 bg-yellow w-full ">
      <p className="text-black font-medium text-xs md:text-sm">Welcome To</p>
      <div className="rounded-full font-bold text-lg md:text-2xl flex text-purple items-center justify-center"><h1 className="text-inherit font-poppins">BEAMS TODAY</h1></div>
      <p className="text-black font-medium text-xs md:text-base ">Your Daily Dose of Innovation</p>
    </div>
    </div> */}
    </div>
  );  
};

export default Header;
