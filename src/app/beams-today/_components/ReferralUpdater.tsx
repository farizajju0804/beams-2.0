'use client';

import { updateReferral } from "@/actions/auth/updateReferral";
import { useEffect } from "react";


const ReferralUpdater: React.FC = () => {
  useEffect(() => {
    const updateReferralCode = async () => {
      const referralCode = localStorage.getItem('referral'); // Check for referral code in local storage

      // If referral code exists, updateReferral and handle success or failure
      if (referralCode) {
        try {
          const success = await updateReferral(referralCode); // Call updateReferral function
        } catch (error) {
          console.error("Failed to update referral:", error); // Log any error if update fails
        } finally {
          localStorage.removeItem('referral'); // Always remove referral code from local storage
        }
      }
    };

    updateReferralCode(); // Execute the function when the component mounts
  }, []);

  return null; // This component doesn't render anything
};

export default ReferralUpdater;
