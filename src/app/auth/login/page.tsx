import type { FC } from "react"; // Importing React's FC (Function Component) type for typing the component
import LoginForm from "@/app/auth/_components/login-form"; // Importing the login form component
import { Suspense } from 'react'; // Importing Suspense for handling lazy loading of components
import { getClientIp } from "@/utils/getClientIp"; // Utility to fetch the client's IP address

import LoginSide from "../_components/LoginSide"; // Importing a side component, possibly a UI element on the login page

// Defining the props for the LoginPage component, although no props are used in this case
interface LoginPageProps {}

/**
 * LoginPage component that handles rendering the login form and side UI.
 * It fetches the client's IP address and checks for any pending email verification 
 * based on that IP.
 */
const LoginPage: FC<LoginPageProps> = async ({}) => {
  const ip = await getClientIp(); // Fetch the client's IP address

  return (
    // Wrapping the main content in Suspense for potential lazy loading
    <Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full">
        {/* Render the LoginSide component on the left, hide based on the 'show' prop */}
        <LoginSide show={false} />

        {/* Main content area where the login form is rendered */}
        <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
          {/* Pass the client's IP and pending email verification status to the LoginForm */}
          <LoginForm ip={ip}  />
        </div>
      </div>
    </Suspense>
  );
};

export default LoginPage; // Exporting the component as the default export
