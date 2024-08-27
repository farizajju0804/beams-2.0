import React from 'react'
import Contactheader from './_components/Contactheader'
import ContactFooter from './_components/ContactFooter'
import ContactFormContainer from './_components/ContactFormContainer'

const Contact = () => {
  return (
    <div className='w-full max-w-7xl mx-auto'>
      <Contactheader/>
      <ContactFormContainer/>
      <ContactFooter/>
    </div>
  )
}

export default Contact