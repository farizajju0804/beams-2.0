import Image from "next/image";
import React from "react";
import Breadcrumbs from "../Breadcrumbs";

const Header = () => {
  return (
    <div className="w-full">
      <div className="pl-6 md:pl-12 mt-2">
      <Breadcrumbs
        items={[
          { href: "/", name:"Home" },
          { name: "Beams Today" },
        ]}
      />
      </div>
   
    <div className="flex gap-2 flex-col justify-center items-center py-4 bg-[#F9D42E] w-full ">
      <p className="text-black font-medium text-sm md:text-base">Welcome To</p>
      <div className="rounded-full font-display font-bold text-xl md:text-2xl  p-4 flex bg-[#370075] text-[#F9D42E] items-center justify-center"><h1>Beams Today</h1></div>
      <p className="text-black font-medium text-sm md:text-base">Your Daily Dose of Innovation</p>
    </div>
    </div>
  );
};

export default Header;
