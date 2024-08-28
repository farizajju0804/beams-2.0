import { Button } from '@nextui-org/react'
import { Sms } from 'iconsax-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const FAQFooter = () => {

  return (
    <div className='w-full max-w-6xl mx-auto flex items-center justify-center flex-col gap-8 p-4'>
        <p className='text-text w-full text-center'>Can&apos;t find the answer you are looking for? We&apos;re Not Hiding It (Promise).</p>
        <Link href='/contact-us'>
        <Button   size='lg' color="primary" className='text-white text-lg font-medium' startContent={<Sms/>}>Contact Us</Button>
        </Link>    
    </div>
  )
}

export default FAQFooter