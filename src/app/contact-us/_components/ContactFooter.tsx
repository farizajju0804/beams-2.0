import { Location, Sms } from 'iconsax-react';
import Image from 'next/image';
import React from 'react';

const ContactFooter = () => {
  return (
    <div className='w-full text-center mx-auto my-4 px-4'>
      <h1 className='font-bold font-poppins text-2xl md:text-3xl text-purple mb-4'>Reach Out To Us</h1>
      <div className='w-full flex flex-col gap-6 items-center justify-center'>
        <Image priority src={'/images/san-francisco.png'} alt='san francisco' width={300} height={300} />
        <div className='flex mx-auto w-fit justify-center gap-4 items-center'>
          <div className='bg-yellow w-8 h-8 flex rounded-full items-center justify-center text-purple'>
            <Location variant='Bold' size={18} />
          </div>
          <p className='text-gray-700'>San Francisco, CA, USA</p>
        </div>
        <div className='flex mx-auto w-fit justify-center gap-4 items-center'>
          <div className='bg-yellow w-8 h-8 flex rounded-full items-center justify-center text-purple'>
            <Sms variant='Bold' size={18} />
          </div>
          <a href="mailto:info@beams.world" className='text-gray-700 '>
            info@beams.world
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactFooter;
