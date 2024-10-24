import React from 'react'
import LoginSide from '../_components/LoginSide'
import ChangeEmail from './changeEmail'

const page = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-start md:min-h-screen w-full ">
    <LoginSide show={false}/>
    <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
    <ChangeEmail/>
    </div>
    </div>
  )
}

export default page