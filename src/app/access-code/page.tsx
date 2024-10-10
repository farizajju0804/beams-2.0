'use client';

import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Input } from "@nextui-org/react"
import { Unlock, Sms } from 'iconsax-react'
import Link from 'next/link'
import Image from 'next/image'
import { updateAccessStatus } from '@/actions/auth/updateAccessStatus'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { motion } from 'framer-motion';
import { updateAccessibleStatus } from '@/actions/auth/updateReferral';
import RedirectMessage from '@/components/Redirection';
type FormData = {
  [key: string]: string;
}

export default function AccessCodeComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)  // Redirection state
  const [isReferralProcessed, setIsReferralProcessed] = useState(false); // State to track referral processing

  const { data: session, update } = useSession();  // Retrieve session data
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const router = useRouter();  // Initialize router
  const { control, handleSubmit, formState: { errors }, setValue, trigger } = useForm<FormData>({
    defaultValues: {
      code1: '', code2: '', code3: '', code4: '',
      code5: '', code6: '', code7: '', code8: ''
    }
  })

  // Process referral code on component mount
  useEffect(() => {
    const updateReferralCode = async () => {
      const referralCode = localStorage.getItem('referral'); // Check for referral code in local storage

      if (referralCode) {
        setIsRedirecting(true);  // Show redirection message while processing referral

        try {
          await updateAccessibleStatus(); 
          await update({
            ...session,
            user: {
              ...session?.user,
              isAccessible: true,
            },
          });
          
          router.push('/user-info')
        } catch (error) {
          console.error("Failed to update referral:", error); // Log error if update fails
        } finally {
          setIsRedirecting(false);  // Stop showing redirection message
         
        }
      } else {
        setIsReferralProcessed(true); // If no referral code, directly show access form
      }
    };

    updateReferralCode(); // Execute referral update on component mount
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
  
    try {
      const accessCode = Object.values(data).join('')  // Combine all the code parts into one access code
      const result = await updateAccessStatus(accessCode)  // Call the server action directly
  
      if (result.status === 'success') {
        setSubmitStatus('success')
        await update({
          ...session,
          user: {
            ...session?.user,
            isAccessible: true,
          },
        });
        setIsRedirecting(true);
        router.push('/user-info');  // Redirect to user-info page on success
      } else {
        setSubmitStatus('error')
      }
    } catch (error: any) {
      setSubmitStatus('error')
      console.error('Error verifying access code:', error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    const lastChar = value.charAt(value.length - 1)
    if (value.length <= 1 && /^[A-Z0-9]$/.test(lastChar)) {
      setValue(`code${index}`, lastChar)
      if (lastChar !== '') {
        if (index < 8) {
          const nextInput = document.getElementById(`code${index + 1}`)
          nextInput?.focus()
        }
      }
      trigger(`code${index}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault()
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  }

  // Render redirection message if referral is processing or if the user is being redirected
  if (isRedirecting || !isReferralProcessed) {
    return <RedirectMessage />;
  }

  // Render the access code form after referral processing is complete
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        className="bg-background rounded-2xl shadow-defined p-8 w-full max-w-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-6 flex justify-center"
          variants={childVariants}
        >
          <Image
            src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1728500925/authentication/accesscode_pygvhw.webp"
            alt="Decorative lock icon"
            width={200}
            height={400}
            className="rounded-lg p-4"
          />
        </motion.div>
        <motion.h1 
          className="text-2xl md:text-3xl font-semibold text-center mb-6 text-text font-poppins"
          variants={childVariants}
        >
          Enter Magic Code
        </motion.h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div 
            className="flex items-center justify-center gap-2 sm:gap-4"
            variants={childVariants}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <Controller
                key={num}
                name={`code${num}`}
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id={`code${num}`}
                    type="text"
                    maxLength={1}
                    variant='bordered'
                    color='primary'
                    className="text-center"
                    size="sm"
                    classNames={{
                      input: "text-center text-2xl md:text-3xl font-bold uppercase",
                      inputWrapper: "w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:w-12"
                    }}
                    onChange={(e) => {
                      field.onChange(e)
                      handleInputChange(num)(e)
                    }}
                    onKeyDown={handleKeyDown}
                  />
                )}
              />
            ))}
          </motion.div>
          <motion.div variants={childVariants}>
            <Button 
              type="submit" 
              color="primary"
              size="lg"
              className="w-full text-white font-semibold"
              isLoading={isSubmitting}
              startContent={
                !isSubmitting && <Unlock variant='Bold'  /> 
              }
            >
              {isSubmitting ? 'Verifying...' : 'Unlock'}
            </Button>
          </motion.div>
        </form>
       
        {submitStatus === 'error' && (
          <motion.p 
            className="mt-4 text-center text-red-600 font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Oh! That&apos;s not the magic code. Try again, or ask a wizard for help!
          </motion.p>
        )}
        <motion.div 
          className="mt-6 text-center space-y-4"
          variants={childVariants}
        >
          <Link href="/contact-us" passHref>
            <Button 
              color="primary"
              variant="bordered"
              className="font-semibold"
              startContent={<Sms variant='Bold'/>}
            >
              Contact the Keeper of the Code
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
