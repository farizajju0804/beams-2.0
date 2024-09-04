import ForgotEmailForm from '@/app/auth/_components/forgot-email-form'
import React from 'react'
import LoginSide from '../_components/LoginSide'
import VerifyEmail from './changeEmailVerify'

const page = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full ">
    <LoginSide show={false}/>
    <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
     <VerifyEmail/>
    </div>
    </div>
  )
}

export default page