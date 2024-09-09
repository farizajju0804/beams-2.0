import React from 'react'
import Contactheader from './_components/Contactheader'  // Import the header component for the contact page
import ContactFooter from './_components/ContactFooter'  // Import the footer component for the contact page
import ContactFormContainer from './_components/ContactFormContainer'  // Import the form container for the contact page
import { currentUser } from '@/libs/auth'  // Import the currentUser function to check if the user is authenticated
import Nav from '@/components/Navbar'  // Import the navigation component for authenticated users
import PublicNav from '@/components/PublicNav'  // Import the public navigation component for unauthenticated users

// Asynchronous functional component for the Contact page
const Contact = async () => {
  const user = await currentUser();  // Fetch the current user's information

  return (
    <div className='w-full max-w-7xl mx-auto'>  {/* Main container for the page */}
      {user ? <Nav /> : <PublicNav />}  {/* Conditionally render Nav or PublicNav based on user authentication */}
      <Contactheader />  {/* Render the contact page header */}
      <ContactFormContainer />  {/* Render the contact form */}
      <ContactFooter />  {/* Render the contact page footer */}
    </div>
  )
}

export default Contact;  // Export the component as default
