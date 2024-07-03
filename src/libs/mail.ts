import { sendEmailBrevo } from "@/libs/brewo";

export const sendVerificationEmail = async (
    email : string,
    token : string
)  => {
    const confirmLink = `localhost:3000/auth/new-verification?token=${token}`


const payload = {
    sender: {
      email: "ajfariz13@gmail.com",
      name: "Beams",
    },
    subject: "Sign up Confirm",
    templateId: 11,
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