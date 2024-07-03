import { sendEmailBrevo } from "@/libs/brewo";

export const sendVerificationEmail = async (
    email : string,
    token : string
)  => {
    const confirmLink = `${process.env.URL}/auth/new-verification?token=${token}`


const payload = {
    sender: {
      email: "innbrieff@gmail.com",
      name: "Beams",
    },
    subject: "Sign up Confirm",
    templateId: 8,
    params: {
      link : confirmLink
    },
    messageVersions: [
      {
        to: [
          {
            email: email
          },
        ],
        params: {
          link : confirmLink
        },
        subject: `Sign up Confirm"`,
      },
    ],
  };
  sendEmailBrevo({ payload });


}


export const sendPasswordResetEmail = async (
  email : string,
  token : string
)  => {
  const confirmLink = `${process.env.URL}/auth/new-password?token=${token}`
 

const payload = {
  sender: {
    email: "innbrieff@gmail.com",
    name: "Beams",
  },
  subject: "Reset Password",
  templateId: 9,
  params: {
    link : confirmLink
  },
  messageVersions: [
    {
      to: [
        {
          email: email
        },
      ],
      params: {
        link : confirmLink
      },
      subject: `Reset password"`,
    },
  ],
};
sendEmailBrevo({ payload });


}