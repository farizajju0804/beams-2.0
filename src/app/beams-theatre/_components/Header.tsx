import React from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import NowShowing from "./NowShowing";
import { Spotlight } from "./Spotlight";
import TicketTitle from "./TicketTitle";

const Header = () => {
  return (
    <div className="relative w-full pt-4 bg-black" 
    style={{ 
      backgroundImage: `url(${'/images/beams-theatre/theatre-bg.png'})`, 
      backgroundSize: 'cover', 
      backgroundRepeat: 'no-repeat', 
      backgroundPosition: 'center' 
    }}
    >
      {/* <div className="pl-6 md:pl-12">
        <Breadcrumbs
        pageClassName="text-background"
        linkClassName="text-grey-1"
          items={[
            { href: "/", name: "Home" },
            { name: "Beams Theatre" },
          ]}
        />
      </div> */}

      <div className="flex gap-1 flex-col justify-center items-center py-2 w-full ">
        <p className="text-white font-medium text-xs md:text-sm">Welcome To</p>
        <div className="font-display px-2 font-bold text-lg md:text-2xl flex my-2 bg-white text-black items-center justify-center">
          <h1 className="text-inherit tracking-wider">Beams Theatre</h1>
        </div>
        <p className="text-white font-medium text-xs md:text-base ">
          where learning takes Center Stage
        </p>
      </div>
      <NowShowing />
      {/* <Spotlight fill="white" className="-left-80 top-0 rotate-180 transform -translate-x-1/2 -translate-y-1/2 z-[3]" /> */}
      {/* <div className="absolute w-full top-0 left-0"> */}
      <div className="w-full">
      <Spotlight  className="left-0 transform top-0  z-[2]" />

      </div>
      {/* <div className="w-full ">
      <Spotlight  className="right-0 bottom-0 transform z-[3]" />
      </div> */}

{/* 
      </div> */}
      {/* <div className="absolute w-full top-0 right-0">
      <Spotlight  className="right-0 bottom-0 transform rotate-180  z-[3]" />

      </div> */}
    </div>
  );
};

export default Header;
