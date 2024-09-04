import ResetForm from '@/app/auth/_components/reset-form'
import React from 'react'
import LoginSide from '../_components/LoginSide'

const ResetPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full">
     <LoginSide show={false}/>
     <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
    <ResetForm/>
    </div>
    </div>
  )
}

export default ResetPage