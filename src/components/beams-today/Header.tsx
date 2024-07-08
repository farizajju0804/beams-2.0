import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-8 bg-yellow-400 rounded-xl max-w-5xl w-full p-4 md:p-8">
      <div className="flex flex-col items-start justify-center gap-5">
        <Image
          src="/images/beams-today/beams-today.png"
          alt="Beams Today"
          width={170}
          height={40}
        />
        <p className="text-lg md:text-xl font-semibold text-black">
          Stay updated with the latest technologies
        </p>
      </div>
      <Image
        src="/images/beams-today/beams-today-header.png"
        alt="Beams Today"
        width={140}
        height={140}
        className="h-20 md:h-28"
      />
    </div>
  );
};

export default Header;
