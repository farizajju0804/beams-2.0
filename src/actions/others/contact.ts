'use server'

import { db } from "@/libs/db";
import { sendContactResponseEmail } from "@/libs/mail";

export async function saveContactFormResponse(data: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const response = await db.contactFormResponse.create({
      data,
    });
    await sendContactResponseEmail(data.email)
    return response;
  } catch (error) {
    console.error('Failed to save contact form response:', error);
    throw new Error('Failed to save contact form response');
  }
}
