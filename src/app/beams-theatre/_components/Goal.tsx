import Image from 'next/image'
import React from 'react'

const Goal = () => {
  return (
    <div className="w-full flex justify-center items-center gap-6 lg:gap-12 flex-col md:flex-row bg-background">
        <h1 className='font-poppins my-auto text-text font-semibold text-xl lg:text-3xl'>Become a <span className='text-secondary-2'>Material Expert</span></h1>
        <Image src='/images/beams-theatre/master.png' width={200} height={200} alt='expert'/>
    </div>
  )
}

export default Goal