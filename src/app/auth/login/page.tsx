import type { FC } from "react";
import LoginForm from "@/components/auth/login-form";

interface LoginPageProps {}
import { Suspense } from 'react'

const LoginPage = ({}) => {
  return (
    <Suspense>
    <LoginForm />
    </Suspense>
  )
 
};

export default LoginPage;