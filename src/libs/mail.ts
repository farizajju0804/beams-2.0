// Importing the `sendEmailBrevo` function from the email utility module
import { sendEmailBrevo } from '@/libs/brewoEmail';

/**
 * Sends a verification email to the user for email verification.
 * 
 * @param {string} email - Recipient email address.
 * @param {string} token - Verification token to be included in the email.
 * @returns {Promise<any>} - A promise that resolves when the email is sent.
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  const link = `${process.env.URL}/auth/new-verify-email?email=${email}`; // Generate verification link

  const payload = {
    sender: {
      email: "innbrieff@gmail.com", // Sender's email
      name: "Beams", // Sender's name
    },
    to: [
      {
        email: email, // Recipient's email
      },
    ],
    subject: "Confirmation Code", // Email subject
    templateId: 13, // Email template ID in Brevo
    params: {
      token: token, // Token to be used in the email template
      link: link, // Link to be included in the email
    },
  };
  return sendEmailBrevo(payload); // Send the email using the Brevo API
};

/**
 * Sends a verification email with a custom template that includes the user's first name.
 * 
 * @param {string} email - Recipient email address.
 * @param {string} firstName - Recipient's first name to personalize the email.
 * @param {string} token - Verification token to be included in the email.
 * @returns {Promise<any>} - A promise that resolves when the email is sent.
 */
export const sendVerificationEmail3: any = async (email: string, firstName: string, token: string) => {
  const link = `${process.env.URL}/auth/verify-email?email=${email}`;

  const payload = {
    sender: {
      email: "innbrieff@gmail.com",
      name: "Beams",
    },
    to: [
      {
        email: email,
      },
    ],
    subject: "Confirmation Code",
    templateId: 13,
    params: {
      token: token,
      firstName: firstName,
      link: link,
    },
  };
  return sendEmailBrevo(payload);
};

/**
 * Sends an email to verify a user's request to change their email address.
 * 
 * @param {string} email - New email address of the user.
 * @param {string} oldEmail - Old email address of the user.
 * @param {string} firstName - Recipient's first name to personalize the email.
 * @param {string} token - Verification token for email change.
 * @returns {Promise<any>} - A promise that resolves when the email is sent.
 */
export const sendVerificationEmail2 = async (email: string, oldEmail: string, firstName: string, token: string) => {
  const link = `${process.env.URL}/auth/change-email-verify?email=${email}&oldEmail=${oldEmail}`;

  const payload = {
    sender: {
      email: "innbrieff@gmail.com",
      name: "Beams",
    },
    to: [
      {
        email: email,
      },
    ],
    subject: "Confirmation Code",
    templateId: 13,
    params: {
      token: token,
      firstName: firstName,
      link: link,
    },
  };
  return sendEmailBrevo(payload);
};

/**
 * Sends an email to confirm an email change request.
 * 
 * @param {string} email - New email address of the user.
 * @param {string} firstName - Recipient's first name to personalize the email.
 * @param {string} token - Token to confirm the email change.
 * @returns {Promise<any>} - A promise that resolves when the email is sent.
 */
export const sendChangeEmail = async (email: string, firstName: string, token: string) => {
  const confirmLink = `${process.env.URL}/auth/change-email?token=${token}`;

  const payload = {
    sender: {
      email: "innbrieff@gmail.com",
      name: "Beams",
    },
    to: [
      {
        email: email,
      },
    ],
    subject: "Change Email",
    templateId: 14, // Template for email change confirmation
    params: {
      link: confirmLink,
      firstName: firstName,
    },
  };
  return sendEmailBrevo(payload);
};

/**
 * Sends a password reset email.
 * 
 * @param {string} email - Recipient's email address.
 * @param {string} firstName - Recipient's first name to personalize the email.
 * @param {string} token - Password reset token.
 * @returns {Promise<any>} - A promise that resolves when the email is sent.
 */
export const sendPasswordResetEmail = async (email: string, firstName: string, token: string) => {
  const confirmLink = `${process.env.URL}/auth/new-password?token=${token}`;

  const payload = {
    sender: {
      email: "innbrieff@gmail.com",
      name: "Beams",
    },
    to: [
      {
        email: email,
      },
    ],
    subject: "Reset Password",
    templateId: 9, // Password reset email template
    params: {
      link: confirmLink,
      firstName: firstName,
    },
  };
  return sendEmailBrevo(payload);
};

/**
 * Sends an email to inform the user of their username.
 * 
 * @param {string} email - Recipient's email address.
 * @param {string} username - The username to include in the email.
 * @returns {Promise<any>} - A promise that resolves when the email is sent.
 */
export const sendUsernameEmail = async (email: string, username: string) => {
  const link = `${process.env.URL}/auth/login}`;

  const payload = {
    sender: {
      email: "innbrieff@gmail.com",
      name: "Beams",
    },
    to: [
      {
        email: email,
      },
    ],
    subject: "Your username",
    templateId: 10, // Username reminder email template
    params: {
      link: link,
      username: username,
    },
  };
  return sendEmailBrevo(payload);
};

/**
 * Sends a two-factor authentication token via email.
 * 
 * @param {string} email - Recipient's email address.
 * @param {string} firstName - Recipient's first name to personalize the email.
 * @param {string} token - Two-factor authentication token.
 * @returns {Promise<any>} - A promise that resolves when the email is sent.
 */
export const sendTwoFactorTokenEmail = async (email: string, firstName: string, token: string) => {
  const payload = {
    sender: {
      email: "innbrieff@gmail.com",
      name: "Beams",
    },
    to: [
      {
        email: email,
      },
    ],
    subject: "Confirmation Code",
    templateId: 11, // Two-factor authentication email template
    params: {
      token: token,
      firstName: firstName,
    },
  };
  return sendEmailBrevo(payload);
};

/**
 * Sends a reminder email that the password has been reset.
 * 
 * @param {string} email - Recipient's email address.
 * @param {string} firstName - Recipient's first name to personalize the email.
 * @returns {Promise<any>} - A promise that resolves when the email is sent.
 */
export const sendPasswordResetReminderEmail = async (email: string, firstName: string) => {
  const link = `${process.env.URL}/auth/login}`;

  const payload = {
    sender: {
      email: "innbrieff@gmail.com",
      name: "Beams",
    },
    to: [
      {
        email: email,
      },
    ],
    subject: "Your Password has been changed",
    templateId: 12, // Password reset reminder email template
    params: {
      link: link,
      firstName: firstName,
    },
  };
  return sendEmailBrevo(payload);
};

/**
 * Sends a contact response email.
 * 
 * @param {string} email - Recipient's email address.
 * @param {string} firstName - Recipient's first name to personalize the email.
 * @returns {Promise<any>} - A promise that resolves when the email is sent.
 */
export const sendContactResponseEmail = async (email: string, firstName: string) => {
  const payload = {
    sender: {
      email: "innbrieff@gmail.com",
      name: "Beams",
    },
    to: [
      {
        email: email,
      },
    ],
    subject: "Thank You for Reaching Out to Us!",
    templateId: 16, // Contact response email template
    params: {
      firstName: firstName,
    },
  };
  return sendEmailBrevo(payload);
};
