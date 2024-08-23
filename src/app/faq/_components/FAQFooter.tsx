import { Button } from '@nextui-org/react'
import { Sms } from 'iconsax-react'
import React from 'react'

const FAQFooter = () => {
  return (
    <div className='w-full max-w-6xl flex items-center justify-center flex-col gap-8 p-4 mb-4'>
        <p className='text-black w-full text-center'>Can`&apos;`t find the answer you are looking for? We`&apos;`re Not Hiding It (Promise).</p>
        <Button size='lg' color="primary" className='text-white text-lg font-medium' startContent={<Sms/>}>Contact Us</Button>
    </div>
  )
}

export default FAQFooter