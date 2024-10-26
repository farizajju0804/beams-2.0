'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input } from "@nextui-org/react";
import { BsFillUnlockFill } from "react-icons/bs";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import RedirectMessage from '@/components/Redirection';
import Image from 'next/image';
import Link from 'next/link';
import { updateAccessStatus } from '@/actions/auth/updateAccessStatus';
import { updateAccessibleStatus } from '@/actions/auth/updateReferral';


type FormData = {
  accessCode: string;
};

export default function AccessCodeComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isReferralProcessed, setIsReferralProcessed] = useState(false);

  const { data: session, update } = useSession();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | string>('idle');
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      accessCode: '',
    },
    reValidateMode : "onSubmit"
  });

  useEffect(() => {
    const updateReferralCode = async () => {
      const referralCode = localStorage.getItem('referral');

      if (referralCode) {
        setIsRedirecting(true);

        try {
          const result = await updateAccessibleStatus(referralCode);
          if (result.success) {
            await update({
              ...session,
              user: {
                ...session?.user,
                isAccessible: true,
              },
            });
          setIsRedirecting(true);
            router.push('/user-info');
          }
          else {
            setIsReferralProcessed(true);
          }
        
          // router.push('/user-info');
        } catch (error) {
          console.error("Failed to update referral:", error);
        } finally {
          // localStorage.removeItem('referral');
          setIsRedirecting(false);
        }
      } else {
        setIsReferralProcessed(true);
      }
    };

    updateReferralCode();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const result = await updateAccessStatus(data.accessCode);
      if (result.status === 'success') {
        setSubmitStatus('success');
        await update({
          ...session,
          user: {
            ...session?.user,
            isAccessible: true,
          },
        });
        setIsRedirecting(true);
        router.push('/user-info');
      } else {
        setSubmitStatus(result.message || 'Unknown error occurred');
      }
    } catch (error: any) {
      setSubmitStatus('Network or server error. Please Check your internet or try again later.');
      console.error('Error verifying access code:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]{0,6}$/.test(value)) {
      e.target.value = value; // Restrict to alphanumeric and max 6 characters
    }
  };

  if(isRedirecting || !isReferralProcessed){
    return (
      <RedirectMessage/>
    )
  }
 
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="bg-background rounded-2xl shadow-defined p-8 w-full max-w-xl"
      >
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
        <motion.h1 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-text font-poppins">
          Enter Invitation Code
        </motion.h1>
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
                  classNames={{
                    input: "text-center font-semibold",
                  }}
                  onChange={(e) => {
                    handleInputChange(e);
                    field.onChange(e);
                  }}
                />
              )}
            />
          </motion.div>

          {/* Display error messages if validation fails */}
          {errors.accessCode && (
            <motion.p className="text-red-600 text-center">
              {errors.accessCode.message}
            </motion.p>
          )}

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
        {submitStatus !== 'idle' && submitStatus !== 'success' && (
          <motion.p className="mt-4 text-center text-red-600 font-semibold">
            {submitStatus}
          </motion.p>
        )}

        <motion.div className="mt-8 text-center space-y-4">
          <Link href="/contact-us" className="text-grey-2 underline">
            Need Help?
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
