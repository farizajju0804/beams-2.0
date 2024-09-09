// Import the Brevo (formerly SendinBlue) SDK for sending transactional emails
const brevo = require('@getbrevo/brevo');

// Create an instance of the TransactionalEmailsApi class
let apiInstance = new brevo.TransactionalEmailsApi();

// Set up API key authentication for the Brevo API
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO; // Fetch the API key from environment variables for security

// Define an interface for the payload to ensure type safety and clarity when sending emails
interface SendEmailPayload {
  sender: {       // Sender details
    email: string; // Sender email address
    name: string;  // Sender name
  };
  to: {           // Recipient details, can have multiple recipients
    email: string; // Recipient email address
    name?: string; // Optional recipient name
  }[];
  subject: string;    // Subject line of the email
  templateId: number; // The ID of the email template to use
  params?: Record<string, any>; // Optional parameters to be passed to the template
}

/**
 * Function to send an email via Brevo using a predefined template.
 * 
 * @param {SendEmailPayload} payload - The payload containing sender, recipients, subject, template ID, and optional parameters.
 * 
 * @returns {Promise<{success?: string, error?: string}>} - A promise that resolves to a success or error message.
 */
export const sendEmailBrevo = async (payload: SendEmailPayload) => {
  // Create a new instance of SendSmtpEmail, which represents the email to be sent
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  // Set the email's sender, recipient(s), subject, template, and parameters from the payload
  sendSmtpEmail.sender = payload.sender;
  sendSmtpEmail.to = payload.to;
  sendSmtpEmail.subject = payload.subject;
  sendSmtpEmail.templateId = payload.templateId;
  sendSmtpEmail.params = payload.params;

  try {
    // Call the Brevo API to send the transactional email using the provided data
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    // Log the returned data upon a successful API call
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    
    // Return a success message
    return { success: "Email sent successfully" };
  } catch (error) {
    // Log any error that occurs during the email sending process
    console.error('Error sending email:', error);

    // Return an error message indicating failure
    return { error: "Failed to send email" };
  }
};
