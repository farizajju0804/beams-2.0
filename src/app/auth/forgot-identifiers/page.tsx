import ForgotEmailForm from '@/app/auth/_components/forgot-email-form'
import React from 'react'
import LoginSide from '../_components/LoginSide'

const page = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full ">
    <LoginSide show={false}/>
    <div className="w-full lg:w-[50%] md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
    <ForgotEmailForm/>
    </div>
    </div>
  )
}

export default page