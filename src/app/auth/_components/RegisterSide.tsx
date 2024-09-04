import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaStar } from 'react-icons/fa'

const RegisterSide = () => {
  return (
    <div className='lg:min-h-screen p-4 m-0 flex flex-col items-center justify-center xl:justify-around gap-5 bg-yellow w-full'>
        <div className="flex items-start w-full pl-2 md:pl-6">
        <Link href="/">
        <Image src="/images/logo.png" alt="Beams Logo" width={85} height={30} />
        </Link>
      </div>
        <div className='flex flex-col items-start gap-3 w-full pl-2 md:pl-6'>
        <div className='flex items-center gap-2'>
        <span className='font-poppins text-2xl md:text-3xl font-semibold text-purple'>Unlock</span>
        <span className='font-poppins text-2xl md:text-3xl  text-black'>the</span>
        </div>
        <h1 className='font-poppins text-2xl md:text-3xl  text-black'>Future with Beams</h1>
        </div>
        <div className="pl-6 hidden lg:flex flex-col w-full items-start gap-6">
      <div className="flex items-start space-x-2">
        <FaStar className="text-purple w-4 h-4 mt-1" />
        <div>
          <h3 className="text-purple text-lg font-bold">Stay Ahead of the Curve</h3>
          <p className="text-black ">Discover the latest futuristic ideas before they hit the mainstream</p>
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <FaStar className="text-purple w-4 h-4 mt-1" />
        <div>
          <h3 className="text-purple text-lg font-bold">Lead the Way</h3>
          <p className="text-black ">Learn about the latest technological advancements and innovations.</p>
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <FaStar className="text-purple w-4 h-4 mt-1" />
        <div>
          <h3 className="text-purple text-lg font-bold">2 Minute to Futuristic Bliss</h3>
          <p className="text-black">Experience the thrill of learning about the future in just 2 minutes.</p>
        </div>
      </div>
    </div>
        <Image src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725356323/authentication/charcater-signup-2-dev_bfvtxh.webp" alt='login' width={200} height={200} className="hidden md:block" />
    </div>
  )
}

export default RegisterSide