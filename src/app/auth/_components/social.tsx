'use client' // This component runs on the client side

import { Button } from "@nextui-org/react"; // Import Button component from NextUI
import { FcGoogle } from "react-icons/fc"; // Import Google icon from react-icons
import { signIn } from "next-auth/react"; // Import signIn function from next-auth for Google authentication
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"; // Import default login redirect route
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Social component provides a button for Google social login using NextAuth.
 */
const Social = () => {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('referral');
  /**
   * Handles social sign-in via Google
   */
  useEffect(() => {
    if (referralCode) {
      localStorage.setItem('referral', referralCode); // Store referral code in local storage
    }else {
      localStorage.removeItem('referral'); // Remove referral code from local storage if not found in URL
    }
  }, [referralCode]);
  const handleSocialSignIn = () => {

    signIn("google", { redirectTo: DEFAULT_LOGIN_REDIRECT }); // Trigger sign-in with Google and redirect after success
  };

  return (
    <div className="flex items-center flex-col justify-center py-4 px-2 w-full">
      {/* Google sign-in button */}
      <Button
        size="lg" // Large button size
        aria-label="google"
        className="w-full bg-transparent font-medium text-text" // Full-width button with transparent background and styled text
        onClick={handleSocialSignIn} // Handle click for Google sign-in
        variant="bordered" // Bordered button variant
        startContent={<FcGoogle className="h-8 w-8" />} // Add Google icon to the button
      >
        Continue With Google
      </Button>
    </div>
  );
};

export default Social; // Export the component
