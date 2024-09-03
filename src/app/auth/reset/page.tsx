import ResetForm from '@/app/auth/_components/reset-form'
import React from 'react'
import LoginSide from '../_components/LoginSide'

const ResetPage = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full items-center">
     <LoginSide show={false}/>
     <div className="w-full lg:w-[50%] md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
    <ResetForm/>
    </div>
    </div>
  )
}

export default ResetPage