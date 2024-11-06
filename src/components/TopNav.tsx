// TopNav.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ClientTopNav from './ClientTopNav'

const TopNav = async () => {

  return (
    <div className='w-full md:px-8 px-4 py-4 flex items-center justify-between'>
      <div className='hidden md:flex flex-col items-start'>
        <h3 className='font-poppins text-lg mb-1'>Welcome Back</h3>
        <p className='text-[#a8a8a8] text-sm'>Don&apos;t forget to smile today 😊</p>
      </div>
      <div className="md:hidden flex items-center">
        <Link href="/">
          <Image src="/images/logo.png" alt="Beams Logo" width={70} height={25} />
        </Link>
      </div>
      <ClientTopNav />
    </div>
  )
}

export default TopNav;

