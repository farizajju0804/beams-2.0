import React from 'react'
import Contactheader from './_components/Contactheader'
import ContactFooter from './_components/ContactFooter'
import ContactFormContainer from './_components/ContactFormContainer'
import { currentUser } from '@/libs/auth'
import Nav from '@/components/Navbar'
import PublicNav from '@/components/PublicNav'

const Contact = async () => {
  const user = await currentUser();

  return (
    <div className='w-full max-w-7xl mx-auto'>
      {user ? <Nav/> : <PublicNav/>}
      <Contactheader/>
      <ContactFormContainer/>
      <ContactFooter/>
    </div>
  )
}

export default Contact