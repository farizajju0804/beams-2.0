import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@nextui-org/react';


const PublicNav: React.FC = () => {
 
  return (
    <nav className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 p-4 bg-background">
      <div className="flex items-center">
      <Link href="/">
        <Image src="/images/logo.png" alt="Beams Logo" width={70} height={25} />
        </Link>
      </div>

      <div className="flex items-center space-x-6">
      <Link href="/auth/login" prefetch>
    
        <Button 
          color="primary" 
          size='md'
          variant="bordered" 
          className=' font-medium md:text-lg text-text md:w-32 md:px-4 '
         
        >
          Login
        </Button>
        </Link>
        <Link href={'/auth/register'} prefetch>
        <Button 
          color='primary' 
          size='md'
          className='font-medium md:text-lg md:w-32 text-white md:px-4 '
        >
          Sign Up
        </Button>
        </Link>
      </div>

   
    </nav>
  );
};

export default PublicNav;
