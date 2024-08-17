'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Radio, RadioGroup, Input } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormData } from '@/schema';
import CustomDateInput from './CustomDateInput';
import { updateUserMetadata } from '@/actions/auth/register';
import { getLatestUserData } from '@/actions/auth/getLatestUserData';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const UserOnboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'STUDENT' | 'NON_STUDENT'>('STUDENT');
  const [latestUserData, setLatestUserData] = useState<any>(null);
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const { update } = useSession();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: 'onSubmit',
    defaultValues: {
      userType: 'STUDENT',
      firstName: '',
      lastName: '',
      grade: '',
      dob: undefined,
    },
  });

  useEffect(() => {
    const fetchLatestUserData = async () => {
      try {
        const data = await getLatestUserData();
        if (data) {
          form.reset({
            userType: data.userType || 'STUDENT',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            grade: data.grade || '',
            dob: data.dob ? new Date(data.dob) : undefined,
          });
          setUserType(data.userType || 'STUDENT');
          setLatestUserData(data);

          if (data.dob) {
            const date = new Date(data.dob);
            setDay(date.getDate().toString().padStart(2, '0'));
            setMonth((date.getMonth() + 1).toString().padStart(2, '0'));
            setYear(date.getFullYear().toString());
          }
        }
      } catch (error) {
        console.error('Error fetching latest user data:', error);
      }
    };

    fetchLatestUserData();
  }, [form]);

  const handleUserTypeSelection = (value: 'STUDENT' | 'NON_STUDENT') => {
    setUserType(value);
    form.setValue('userType', value);
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const onSubmit = async (data: UserFormData) => {
    setIsPending(true);
    try {
      if (!latestUserData?.email) {
        throw new Error('Email not found.');
      }
  
      const dob = year && month && day ? new Date(`${year}-${month}-${day}`) : undefined;
  
      const values = {
        firstName: data.firstName,
        lastName: data.lastName,
        ...(data.userType === 'STUDENT' && {
          dob,
          grade: data.grade,
        }),
        userType: data.userType,
        userFormCompleted: true,
      };
  
      const response = await updateUserMetadata(latestUserData.email, values);
      if (response?.success) {
        console.log('User metadata updated successfully');
        await update();
        router.push('/onboarding');
      } else {
        console.error('Failed to update user metadata:', response.error);
      }
    } catch (error) {
      console.error('Error updating user metadata:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl p-8"
      >
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-4xl font-bold text-gray-800 font-poppins mb-6"
          >
            Welcome to Beams
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="flex justify-between items-center"
          >
            <p className="text-lg text-gray-600">Step {step} of 2</p>
            <div className="flex">
              <div className={`h-2 w-12 rounded-full ${step === 1 ? 'bg-blue-500' : 'bg-gray-300'} mr-2 transition-colors`}></div>
              <div className={`h-2 w-12 rounded-full ${step === 2 ? 'bg-blue-500' : 'bg-gray-300'} transition-colors`}></div>
            </div>
          </motion.div>
        </div>

        {step === 1 ? (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h3 className="text-2xl font-semibold mb-6">Are you a student or a professional?</h3>
            <RadioGroup
              orientation="vertical"
              value={userType}
              onValueChange={(value) => handleUserTypeSelection(value as 'STUDENT' | 'NON_STUDENT')}
              className="mb-6"
            >
              <Radio value="STUDENT">Student</Radio>
              <Radio value="NON_STUDENT">Professional</Radio>
            </RadioGroup>
            <p className="text-sm text-gray-500 mb-6">
              Note: This choice cannot be changed later.
            </p>
            <Button
              color="primary"
              size="lg"
              className="w-full"
              onClick={handleNextStep}
              disabled={!userType}
            >
              Next
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Input
                {...form.register('firstName')}
                label="First Name"
                placeholder="Enter your first name"
                isRequired
                className="w-full"
              />
              <Input
                {...form.register('lastName')}
                label="Last Name"
                placeholder="Enter your last name"
                isRequired
                className="w-full"
              />
              {userType === 'STUDENT' && (
                <>
                  <Input
                    {...form.register('grade')}
                    label="Grade"
                    placeholder="Enter your grade"
                    isRequired
                    className="w-full"
                  />
                  <CustomDateInput
                    day={day}
                    month={month}
                    year={year}
                    onDayChange={setDay}
                    onMonthChange={setMonth}
                    onYearChange={setYear}
                  />
                </>
              )}
              <div className="flex justify-between mt-6">
                <Button
                  color="secondary"
                  size="lg"
                  className="w-1/3"
                  onClick={handleBackStep}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-2/3"
                  isLoading={isPending}
                >
                  Submit
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default UserOnboarding;
