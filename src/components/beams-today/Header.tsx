import Image from "next/image";
import React from "react";
import Breadcrumbs from "../Breadcrumbs";

const Header = () => {
  return (
    <div className="w-full">
      <div className="pl-6 md:pl-12">
      <Breadcrumbs
      
        items={[
          { href: "/", name:"Home" },
          { name: "Beams Today" },
        ]}
      />
      </div>
   
    <div className="flex gap-1 flex-col justify-center items-center py-2 bg-secondary-1 w-full ">
      <p className="text-black font-medium text-xs md:text-sm">Welcome To</p>
      <div className="rounded-full font-display font-bold text-lg md:text-2xl flex text-secondary-2 items-center justify-center">Beams Today</div>
      <p className="text-black font-medium text-xs md:text-sm ">Your Daily Dose of Innovation</p>
    </div>
    </div>
  );  
};

export default Header;
