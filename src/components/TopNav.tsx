import UserButton from '@/app/auth/_components/user-button'
import { currentUser } from '@/libs/auth'
import {  Notification } from 'iconsax-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const TopNav = async() => {
  const user = await currentUser()
  return (
    <div className='w-full md:px-8 px-4 py-4 flex items-center justify-between'>
        <div className='hidden md:flex flex-col items-start'>
            <h3 className='font-poppins text-lg mb-1'>Welcome Back, {user?.firstName}</h3>
            <p className='text-[#a8a8a8] text-sm'>Don&apos;t forget to smile today 😊</p>
        </div>
        <div className="md:hidden flex items-center">
      <Link href="/">
        <Image src="/images/logo.png" alt="Beams Logo" width={70} height={25} />
        </Link>
      </div>
        <div className='flex items-center justify-center gap-8'>
            <div className='hidden md:block bg-background shadow-defined p-3 rounded-full text-brand '>
                <Notification variant='Bold'/>
            </div>
            <UserButton/>
        </div>
    </div>
  )
}

export default TopNav