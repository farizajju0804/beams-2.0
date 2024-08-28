import React from 'react'
import { motion } from 'framer-motion'
import ContactForm from './ContactForm'
import ContactSide from './ContactSide'

const ContactFormContainer: React.FC = () => {
  return (
    <div 
      className='w-full max-w-5xl mx-auto mt-4 mb-8 md:my-14 flex flex-col md:flex-row shadow-lg rounded-2xl'
    >
      <ContactSide />
      <ContactForm />
    </div>
  )
}

export default ContactFormContainer