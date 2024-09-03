import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const LoginSide = () => {
  return (
    <div className='h-full lg:min-h-screen p-4 px-6 flex flex-col items-center justify-center gap-8 bg-yellow w-full lg:w-[50%]'>
        <div className="flex items-start w-full md:pl-6">
        <Link href="/">
        <Image src="/images/logo.png" alt="Beams Logo" width={85} height={30} />
        </Link>
      </div>
        <div className='flex flex-col items-start gap-3 w-full md:pl-6'>
        <h1 className='font-poppins text-2xl md:text-4xl font-semibold text-purple'>Welcome Back,</h1>
        <p className='font-medium  text-black text base md:text-xl'>Your account missed you</p>
        </div>
        <Image src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725345826/authentication/charcater-login-2-dev_wrtei2.webp" alt='login' width={300} height={400} className="hidden md:block" />
    </div>
  )
}

export default LoginSide