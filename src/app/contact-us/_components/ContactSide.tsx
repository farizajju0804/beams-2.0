import React from 'react'
import Image from 'next/image'

const ContactSide: React.FC = () => {
  return (
    <div 
      className='bg-yellow flex flex-col text-black items-center justify-center p-8 lg:rounded-l-2xl flex-1'
    >
      {/* Heading for large screens */}
      <h2 className='hidden lg:block text-xl md:text-3xl text-left w-full font-poppins font-bold mb-2 md:mb-4'>
        Let&apos;s Have a Talk
      </h2>
      
      {/* Brief description */}
      <p className='mb-4 text-sm font-semibold'>
        Do you have questions, need assistance or want to provide feedback? Our team is always ready to assist you.
      </p>
      
      {/* Displaying the image */}
      <div className='flex items-center justify-center'>
        <Image 
          priority 
          src={'https://res.cloudinary.com/drlyyxqh9/image/upload/v1724910831/email%20images/contact-removebg-preview-66d00c967bcf2_sfhuyb.webp'} 
          alt='contact' 
          className='m-auto' 
          width={270} 
          height={340} 
        />
      </div>
    </div>
  )
}

export default ContactSide
