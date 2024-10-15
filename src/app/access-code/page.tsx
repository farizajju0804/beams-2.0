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
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isReferralProcessed, setIsReferralProcessed] = useState(false);

  const { data: session, update } = useSession();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, setValue, trigger } = useForm<FormData>({
    defaultValues: {
      code1: '', code2: '', code3: '', code4: '', code5: '', code6: ''
    }
  })

  useEffect(() => {
    const updateReferralCode = async () => {
      const referralCode = localStorage.getItem('referral');

      if (referralCode) {
        setIsRedirecting(true);

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
          console.error("Failed to update referral:", error);
        } finally {
          localStorage.removeItem('referral');
          setIsRedirecting(false);
        }
      } else {
        setIsReferralProcessed(true);
      }
    };

    updateReferralCode();
  }, []);

  const onSubmit = async (data: FormData) => {
    console.log("Form data submitted:", data); // Add this to check form submission
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
        const accessCode = Object.values(data).join('');
   
        const result = await updateAccessStatus(accessCode);
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
        router.push('/user-info');
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
        if (index < 6) {
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

  if (isRedirecting || !isReferralProcessed) {
    return <RedirectMessage />;
  }

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
            {[1, 2, 3, 4, 5, 6].map((num) => (
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
          <motion.div className='flex mt-2 items-center justify-center' variants={childVariants}>
            <Button 
              type="submit" 
              color="primary"
              size="md"
              className="w-40 text-white font-semibold"
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
            Oh! That&apos;s not the magic code. Try again, or ask for help!
          </motion.p>
        )}
        <motion.div 
          className="mt-8 text-center space-y-4"
          variants={childVariants}
        >
          <Link href="/contact-us" passHref>
            <Button 
              color="primary"
              variant="bordered"
              size="sm"
              className="font-semibold"
              startContent={<Sms variant='Bold'/>}
            >
              Need Help?
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}