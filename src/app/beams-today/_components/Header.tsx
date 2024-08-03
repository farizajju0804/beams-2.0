import Image from "next/image";
import React from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center">
     <div className="w-full max-w-5xl pl-6 md:pl-12">
      <Breadcrumbs
        pageClassName="text-text"
        linkClassName="text-grey-2"
        items={[
          { href: "/", name:"Home" },
          { name: "Beams Today" },
        ]}
      />
      </div>
   
    <div className="w-[100vw]">
     
   
    <div className="flex gap-1 flex-col justify-center items-center py-2 bg-secondary-1 w-full ">
      <p className="text-black font-medium text-xs md:text-sm">Welcome To</p>
      <div className="rounded-full font-bold text-lg md:text-2xl flex text-secondary-2 items-center justify-center"><h1 className="text-inherit font-poppins">Beams Today</h1></div>
      <p className="text-black font-medium text-xs md:text-base ">Your Daily Dose of Innovation</p>
    </div>
    </div>
    </div>
  );  
};

export default Header;
