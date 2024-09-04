'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { HambergerMenu, CloseCircle } from 'iconsax-react';
import { usePathname } from 'next/navigation';

const PublicNav: React.FC = () => {
  const currentPage = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    // { href: '/about', label: 'About' },
    { href: '/contact-us', label: 'Contact' },
    // { href: '/faq', label: 'FAQ' },
  ];

  const isActive = (path: string) => currentPage === path;

  return (
    <nav className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 p-4 bg-background">
      <div className="flex items-center">
      <Link href="/">
        <Image src="/images/logo.png" alt="Beams Logo" width={70} height={25} />
        </Link>
      </div>
      
      {/* Desktop Menu */}
      <div className="flex items-center space-x-6">
        {/* {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href} 
            className={`text-gray-600 hover:text-gray-900 ${isActive(item.href) ? 'border-b-2 border-brand' : ''}`}
          >
            {item.label}
          </Link>
        ))} */}
        <Button 
          color="primary" 
          size='md'
          variant="bordered" 
          className=' font-medium md:text-lg text-text md:w-32 md:px-4 '
          onClick={() => router.push('/auth/login')}
        >
          Login
        </Button>
        <Button 
          color='primary' 
          size='md'
          className='font-medium md:text-lg md:w-32 text-white md:px-4 '
          onClick={() => router.push('/auth/register')}
        >
          Sign Up
        </Button>
      </div>

      {/* Mobile Menu Button */}
      {/* <div className="hidden z-[100]">
        <motion.div
          initial={false}
          animate={isOpen ? "open" : "closed"}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <CloseCircle size="32" color="#000000"/>
          ) : (
            <HambergerMenu size="32" color="#000000"/>
          )}
        </motion.div>
      </div> */}

      {/* Mobile Menu */}
      {/* <motion.div
        className="fixed top-0 left-0 w-full h-full bg-white z-50 md:hidden"
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col items-center justify-center px-8 h-full space-y-6">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`text-xl text-black ${isActive(item.href) ? ' border-b-2 border-brand' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button 
            color="primary" 
            variant="bordered" 
            className='w-full font-medium text-black md:text-lg'
            onClick={() => {
              setIsOpen(false);
              router.push('/auth/login');
            }}
          >
            Login
          </Button>
          <Button 
            color='primary' 
            className='font-medium md:text-lg text-white w-full'
            onClick={() => {
              setIsOpen(false);
              router.push('/auth/register');
            }}
          >
            Sign Up
          </Button>
        </div>
      </motion.div> */}
    </nav>
  );
};

export default PublicNav;
