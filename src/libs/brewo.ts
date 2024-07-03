"use server";

import axios from "axios";
interface PayloadProps {
  payload: any;
}

export const sendEmailBrevo = async ({ payload }: PayloadProps) => {

  const url = "https://api.brevo.com/v3/smtp/email";
  const apiKey = process.env.BREVO;

  try {
    const response = await axios.post(url, payload, {
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
    });

    console.log("Email sent successfully!", response.data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};