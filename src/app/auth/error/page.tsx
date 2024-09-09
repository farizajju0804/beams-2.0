import { ErrorCard } from "@/app/auth/_components/error-card"; // Import the ErrorCard component

/**
 * AuthErrorPage component is a simple page that renders an error message
 * or card when an authentication-related error occurs.
 */
const AuthErrorPage = () => {
  return (
    <ErrorCard /> // Render the ErrorCard component to display an error message
  );
};

export default AuthErrorPage; // Export the AuthErrorPage component as the default export
