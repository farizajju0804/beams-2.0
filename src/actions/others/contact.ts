'use server'

import { db } from "@/libs/db"; // Importing the Prisma database connection
import { sendContactResponseEmail } from "@/libs/mail"; // Importing email utility to send confirmation emails

/**
 * Saves the contact form response in the database and sends a confirmation email to the user.
 * 
 * @param {Object} data - The contact form data.
 * @param {string} data.firstName - The first name of the user.
 * @param {string} data.lastName - The last name of the user.
 * @param {string} data.email - The email of the user.
 * @param {string} data.subject - The subject of the contact form.
 * @param {string} data.message - The message submitted by the user.
 * @returns {Promise<Object>} A promise that resolves to the saved contact form response.
 * @throws {Error} If the response saving or email sending fails.
 */
export async function saveContactFormResponse(data: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    // Save the contact form data to the `contactFormResponse` table
    const count = await db.contactFormResponse.count(
      {
        where : {
          email : data.email
        }
        
      }
    )
  
    if(count < 5){
      const response = await db.contactFormResponse.create({
        data, // Pass the entire form data to be stored
      });
  
      // Send a confirmation email to the user after saving the response
      await sendContactResponseEmail(data.email, data.firstName);

      return { success : response }

    }

    else{
      
     return { error : "You currently have more than 5 active queries. Please allow us some time to resolve them before submitting more."}
    }
    // Return the saved response
    
  } catch (error) {
    // Log the error and throw an appropriate message
    console.error('Failed to save contact form response:', error);
    throw new Error('Failed to save contact form response');
  }
}
