import { sendEmailBrevo } from '@/libs/brewoEmail';




export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.URL}/auth/new-verification?token=${token}`;

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
    subject: "Sign up Confirm",
    templateId: 8,
    params: {
      link: confirmLink,
    },
  };
  return sendEmailBrevo(payload);
};
export const sendVerificationEmail2 = async (email: string, token: string) => {
  const confirmLink = `${process.env.URL}/auth/new-email?token=${token}`;

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
    subject: "Sign up Confirm",
    templateId: 8,
    params: {
      link: confirmLink,
    },
  };
  return sendEmailBrevo(payload);
};
export const sendPasswordResetEmail = async (email: string, token: string) => {
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
    templateId: 9,
    params: {
      link: confirmLink,
    },
  };
  return sendEmailBrevo(payload);
};

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
    templateId: 10, // Adjust the templateId if different
    params: {
      link: link,
      username: username,
    },
  };
  return sendEmailBrevo(payload);
};


export const sendTwoFactorTokenEmail = async (email: string, token: string) => {

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
    templateId: 11,
    params: {
      token: token,
    },
  };
  return sendEmailBrevo(payload);
};

export const sendPasswordResetReminderEmail = async (email: string) => {


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
    templateId: 12,
    params: {
    },
  };
  return sendEmailBrevo(payload);
};



// import { sendEmailBrevo } from "@/libs/brewo";

// export const sendVerificationEmail = async (
//     email : string,
//     token : string
// )  => {
//     const confirmLink = `${process.env.URL}/auth/new-verification?token=${token}`


// const payload = {
//     sender: {
//       email: "innbrieff@gmail.com",
//       name: "Beams",
//     },
//     subject: "Sign up Confirm",
//     templateId: 8,
//     params: {
//       link : confirmLink
//     },
//     messageVersions: [
//       {
//         to: [
//           {
//             email: email
//           },
//         ],
//         params: {
//           link : confirmLink
//         },
//         subject: `Sign up Confirm"`,
//       },
//     ],
//   };
//   sendEmailBrevo({ payload });


// }


// export const sendPasswordResetEmail = async (
//   email : string,
//   token : string
// )  => {
//   const confirmLink = `${process.env.URL}/auth/new-password?token=${token}`
 

// const payload = {
//   sender: {
//     email: "innbrieff@gmail.com",
//     name: "Beams",
//   },
//   subject: "Reset Password",
//   templateId: 9,
//   params: {
//     link : confirmLink
//   },
//   messageVersions: [
//     {
//       to: [
//         {
//           email: email
//         },
//       ],
//       params: {
//         link : confirmLink
//       },
//       subject: `Reset password"`,
//     },
//   ],
// };
// sendEmailBrevo({ payload });


// }


// export const sendUsernameEmail = async (
//   email : string,
//   username : string
// )  => {
//   const link = `${process.env.URL}/auth/login}`
 

// const payload = {
//   sender: {
//     email: "innbrieff@gmail.com",
//     name: "Beams",
//   },
//   subject: "Your username",
//   templateId: 9,
//   params: {
//     link : link,
//     username : username
//   },
//   messageVersions: [
//     {
//       to: [
//         {
//           email: email
//         },
//       ],
//       params: {
//         link : link,
//         username : username
//       },
//       subject: `Your Username`,
//     },
//   ],
// };
// sendEmailBrevo({ payload });


// }




