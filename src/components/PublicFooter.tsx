'use client'; 

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; 

const PublicFooter: React.FC = () => {
  const router = useRouter(); 

  return (
    <>
    <footer className="w-full max-w-6xl mx-auto bg-white border-t border-gray-200">
      <div className="w-full max-w-6xl mx-auto  py-8 px-8 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
          <div className="flex flex-col space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image src="/images/logo.png" alt="Beams Logo" width={100} height={40} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-gray-600"
            >
              Email: info@beams.world
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-start md:items-end space-y-4"
          >
            <p className="text-gray-800 font-medium">
              Get started with <span className="text-brand">Beams</span> now
            </p>
            <div className="flex space-x-4">
              <Button
                color="primary"
                className="font-medium text-base md:text-lg w-28"
                onClick={() => router.push('/auth/register')} 
              >
                Sign Up
              </Button>
              <Button
                color="primary"
                variant="bordered"
                className="font-medium text-base md:text-lg w-28"
                onClick={() => router.push('/auth/login')}
              >
                Login
              </Button>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 pt-8 border-t border-gray-200 flex flex-col-reverse md:flex-row justify-between items-center"
        >
          <p className="text-gray-500 text-sm mt-4 md:mt-0">
            © 2024 Beams Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
        
      </div>
      
    </footer>
    <div className='w-full h-1 bg-brand'></div>
    </>
  );
};

export default PublicFooter;
