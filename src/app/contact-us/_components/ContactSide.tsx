
import React from 'react'
import Image from 'next/image'

const ContactSide: React.FC = () => {
  return (
    <div 

      className='bg-yellow flex flex-col items-center justify-center p-8 lg:rounded-l-2xl flex-1'
    >
      <h2 className='text-xl md:text-3xl text-left w-full font-poppins font-bold mb-2 md:mb-4'>Let&apos;s Have a Talk</h2>
      <p className='mb-4 text-sm'>Whether you have questions, need assistance, or just want to provide feedback, our team is ready to assist you.</p>
      <div className='flex items-center justify-center'>
      <Image priority src={'/images/contact.png'} alt='san francisco' className='m-auto' width={270} height={340} />
      </div>
      
    </div>
  )
}

export default ContactSide