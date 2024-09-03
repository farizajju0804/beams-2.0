import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AuthNav: React.FC = () => {
  
  

  return (
    <nav className="w-full max-w-7xl mx-auto flex items-center justify-start px-4 p-4 bg-transparent">
      <div className="flex items-center">
      <Link href="/">
        <Image src="/images/logo.png" alt="Beams Logo" width={85} height={30} />
        </Link>
      </div>
      
    </nav>
  );
};

export default AuthNav;
