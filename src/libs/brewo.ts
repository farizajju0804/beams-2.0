"use server"; // Ensures the code is executed on the server side

// Importing axios for making HTTP requests
import axios from "axios";

// Defining an interface for the payload prop to ensure type safety
interface PayloadProps {
  payload: any; // The payload type is set to 'any' since it can be dynamic
}

/**
 * Function to send an email using the Brevo (formerly SendinBlue) API.
 * 
 * @param {PayloadProps} param - An object containing the email payload.
 * @param {any} param.payload - The payload for the email, which includes all necessary fields such as sender, recipient, subject, and message body.
 * 
 * @returns {Promise<void>} - This function returns a promise that sends the email via the Brevo API. It logs success or error to the console.
 */
export const sendEmailBrevo = async ({ payload }: PayloadProps) => {
  
  // API URL for sending SMTP email using Brevo
  const url = "https://api.brevo.com/v3/smtp/email";

  // API key retrieved from environment variables for authentication
  const apiKey = process.env.BREVO;

  try {
    // Make a POST request to the Brevo API with the payload and required headers
    const response = await axios.post(url, payload, {
      headers: {
        accept: "application/json", // Accept JSON response from the API
        "api-key": apiKey,          // API key for authentication, loaded from environment variable
        "content-type": "application/json", // Specify that the request body is in JSON format
      },
    });

    // Log the success message and response data to the console
    console.log("Email sent successfully!", response.data);
  } catch (error) {
    // Log the error if the request fails
    console.error("Failed to send email:", error);
  }
};
