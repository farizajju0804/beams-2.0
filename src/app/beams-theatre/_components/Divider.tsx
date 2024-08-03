import Image from 'next/image'
import React from 'react'

const Divider = () => {
  return (
    <div className='w-full flex items-center justify-center'>
        <Image src='/images/beams-theatre/divider.png' alt='divider' width={600}  height={30}></Image>
    </div>
  )
}

export default Divider