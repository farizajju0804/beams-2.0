
import React from 'react'
import Image from 'next/image'

const ContactSide: React.FC = () => {
  return (
    <div 

      className='bg-yellow flex flex-col text-black items-center justify-center p-8 lg:rounded-l-2xl flex-1'
    >
      <h2 className='hidden lg:block text-xl md:text-3xl text-left w-full font-poppins font-bold mb-2 md:mb-4'>Let&apos;s Have a Talk</h2>
      <p className='mb-4 text-sm'>Do you have questions, need assistance or want to provide feedback? Our team is always ready to assist you.</p>
      <div className='flex items-center justify-center'>
      <Image priority src={'https://res.cloudinary.com/drlyyxqh9/image/upload/v1724824393/email%20images/contact-66cebb2fd6376_idyaho.webp'} alt='contact' className='m-auto' width={270} height={340} />
      </div>
      
    </div>
  )
}

export default ContactSide