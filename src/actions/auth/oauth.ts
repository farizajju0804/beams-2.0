import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const oAuth = async (provider: "google") => {
    await signIn(provider,{
      callbackUrl : DEFAULT_LOGIN_REDIRECT
    })
  };