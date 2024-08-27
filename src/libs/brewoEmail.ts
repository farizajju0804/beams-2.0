
const brevo = require('@getbrevo/brevo');
let apiInstance = new brevo.TransactionalEmailsApi();

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO;

interface SendEmailPayload {
  sender: {
    email: string;
    name: string;
  };
  to: {
    email: string;
    name?: string;
  }[];
  subject: string;
  templateId: number;
  params?: Record<string, any>;
}

export const sendEmailBrevo = async (payload: SendEmailPayload) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.sender = payload.sender;
  sendSmtpEmail.to = payload.to;
  sendSmtpEmail.subject = payload.subject;
  sendSmtpEmail.templateId = payload.templateId;
  sendSmtpEmail.params = payload.params;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    return { success: "Email sent successfully" };
  } catch (error) {
    console.error('Error sending email:', error);
    return { error: "Failed to send email" };
  }
};
