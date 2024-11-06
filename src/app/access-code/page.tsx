'use client';

// Import necessary libraries and hooks
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';  // For form handling and validation
import { Button, Input } from "@nextui-org/react";      // UI components for form input and button
import { BsFillUnlockFill } from "react-icons/bs";       // Icon for the submit button
import { useSession } from 'next-auth/react';            // Hook to manage session data
import { useRouter } from 'next/navigation';             // Router hook to navigate between pages
import { motion } from 'framer-motion';                  // Animation library for UI elements
import RedirectMessage from '@/components/Redirection';  // Component for redirection messages
import Image from 'next/image';
import Link from 'next/link';
import { updateAccessStatus } from '@/actions/auth/updateAccessStatus';   // Action to update access status
import { updateAccessibleStatus } from '@/actions/auth/updateReferral';   // Action to update referral access

// Define form data type
type FormData = {
  accessCode: string;  // Single field for access code input
};

// Main functional component for access code submission
export default function AccessCodeComponent() {
  // State for managing submission and redirecting status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isReferralProcessed, setIsReferralProcessed] = useState(false);

  // Session and routing setup
  const { data: session, update } = useSession();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | string>('idle');
  const router = useRouter();

  // React Hook Form setup for controlled access code input
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { accessCode: '' },
    reValidateMode: "onSubmit",  // Re-validate only on submit
  });

  // Effect hook for processing referral codes if they exist in local storage
  useEffect(() => {
    const updateReferralCode = async () => {
      const referralCode = localStorage.getItem('referral');

      if (referralCode) {  // Only proceed if a referral code is found
        setIsRedirecting(true);  // Display redirect message during processing

        try {
          // Attempt to update the referral access status
          const result = await updateAccessibleStatus(referralCode);
          if (result.success) {
            // Update session with accessible status if referral was successful
            await update({
              ...session,
              user: { ...session?.user, isAccessible: true },
            });
            setIsRedirecting(true);  // Initiate redirection to user-info page
            router.push('/user-info');
          } else {
            // Allow component to render if referral code is not successfully processed
            setIsReferralProcessed(true);
          }
        } catch (error) {
          console.error("Failed to update referral:", error);  // Log any errors encountered
        } finally {
          setIsRedirecting(false);  // Stop redirecting once processing is complete
        }
      } else {
        setIsReferralProcessed(true);  // No referral; proceed with component render
      }
    };

    updateReferralCode();
  }, []);

  // Form submit handler for verifying the access code
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);        // Set loading state for submit button
    setSubmitStatus('idle');      // Reset submit status

    try {
      const result = await updateAccessStatus(data.accessCode);  // Attempt access code validation
      if (result.status === 'success') {
        setSubmitStatus('success');
        // Update session to mark user as accessible
        await update({
          ...session,
          user: { ...session?.user, isAccessible: true },
        });
        setIsRedirecting(true);
        router.push('/user-info');  // Redirect to user info page on successful verification
      } else {
        setSubmitStatus(result.message || 'Unknown error occurred');  // Handle invalid access codes
      }
    } catch (error: any) {
      // Display server/network error message to user if verification fails
      setSubmitStatus('Network or server error. Please Check your internet or try again later.');
      console.error('Error verifying access code:', error.message);
    } finally {
      setIsSubmitting(false);  // Reset submitting state after process completes
    }
  };

  // Handler to format and restrict input to alphanumeric characters, max 6 characters
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]{0,6}$/.test(value)) {
      e.target.value = value;
    }
  };

  // Display redirection message if still processing referral or redirecting
  if (isRedirecting || !isReferralProcessed) {
    return <RedirectMessage username={session?.user.firstName} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div className="bg-background rounded-2xl shadow-defined p-8 w-full max-w-xl">
        
        {/* Image at the top of the form */}
        <motion.div className="mb-6 flex justify-center">
          <Image
            src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1728500925/authentication/accesscode_pygvhw.webp"
            alt="Decorative lock icon"
            width={200}
            height={400}
            priority
            className="rounded-lg p-4"
          />
        </motion.div>

        {/* Form title */}
        <motion.h1 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-text font-poppins">
          Enter Invitation Code
        </motion.h1>

        {/* Form for access code input */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div className="flex items-center justify-center gap-2 sm:gap-4">
            <Controller
              name="accessCode"
              control={control}
              rules={{
                required: 'Invitation code is required',
                pattern: {
                  value: /^[A-Z0-9]{6}$/,
                  message: 'Code must be exactly 6 alphanumeric characters',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  maxLength={6}
                  autoComplete='code'
                  aria-label='code'
                  variant='bordered'
                  color='primary'
                  placeholder='Enter 6 Digit Invitation code'
                  className="text-center max-w-xs w-60 text-2xl md:text-3xl font-bold uppercase"
                  classNames={{ input: "text-center font-semibold" }}
                  onChange={(e) => {
                    handleInputChange(e);
                    field.onChange(e);
                  }}
                />
              )}
            />
          </motion.div>

          {/* Error message if validation fails */}
          {errors.accessCode && (
            <motion.p className="text-red-600 text-center">
              {errors.accessCode.message}
            </motion.p>
          )}

          {/* Submit button for form */}
          <motion.div className="flex mt-2 items-center justify-center">
            <Button
              type="submit"
              color="primary"
              size="md"
              aria-label='submit'
              className="w-40 text-white text-lg font-semibold"
              isLoading={isSubmitting}
              startContent={!isSubmitting && <BsFillUnlockFill size={20} />}
            >
              {isSubmitting ? 'Verifying...' : 'Get Access'}
            </Button>
          </motion.div>
        </form>

        {/* Error or status message if access code verification fails */}
        {submitStatus !== 'idle' && submitStatus !== 'success' && (
          <motion.p className="mt-4 text-center text-red-600 font-semibold">
            {submitStatus}
          </motion.p>
        )}

        {/* Link to help page */}
        <motion.div className="mt-8 text-center space-y-4">
          <Link href="/contact-us" className="text-grey-2 underline">
            Need Help?
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
