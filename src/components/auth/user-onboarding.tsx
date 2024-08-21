'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Radio, RadioGroup, Input, Select, SelectItem } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormData } from '@/schema';
import CustomDateInput from './CustomDateInput';
import { updateUserMetadata } from '@/actions/auth/register';
import { getLatestUserData } from '@/actions/auth/getLatestUserData';
import { useRouter } from 'next/navigation';
import { getSession, useSession } from 'next-auth/react';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
interface UserOnboardingProps {
  sessionData: any; 
}
const UserOnboarding: React.FC<UserOnboardingProps>  = ({ sessionData }) => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'STUDENT' | 'NON_STUDENT'>('STUDENT');
  const [latestUserData, setLatestUserData] = useState<any>(null);
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const { data: session, update } = useSession();
  console.log(session)
  const router =  useRouter()
  const [isPending, setIsPending] = useState(false);
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: 'onSubmit',
    defaultValues: {
      userType: 'NON_STUDENT',
      firstName: '',
      lastName: '',
      // grade: undefined,
      // dob: undefined,
    },
  });
  
  useEffect(() => {
    const fetchLatestUserData = async () => {
      try {
        const data = await getLatestUserData();
        if (data) {
          form.reset({
            userType: data.userType || 'NON_STUDENT',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            grade: data.grade || '',
            dob: data.dob ? new Date(data.dob) : undefined,
          });
          setUserType(data.userType || 'NON_STUDENT');
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

  const onSubmit:any = async (data: UserFormData) => {
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
  
     const updatedUser:any = await updateUserMetadata(latestUserData?.email, values);
     if(updatedUser){
      const updated = await update({
        ...session,
        user:{
        ...session?.user,
        userFormCompleted : true
        }
      }
      );
      console.log("Updated session data:", updated);
      router.push('/onboarding');

     }
     
    } catch (error) {
      console.error('Error updating user metadata:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen w-[80%] md:w-auto flex items-center justify-center md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-3xl md:p-4"
      >
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-3xl lg:text-4xl font-bold text-text font-poppins mb-6"
          >
            Welcome to Beams
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="flex justify-between items-center"
          >
            <p className="text-sm text-grey-2">Step {step} of 2</p>
            <div className="flex">
              <div className={`h-2 w-12 rounded-full ${step === 1 ? 'bg-brand' : 'bg-gray-300'} mr-2 transition-colors`}></div>
              <div className={`h-2 w-12 rounded-full ${step === 2 ? 'bg-brand' : 'bg-gray-300'} transition-colors`}></div>
            </div>
          </motion.div>
        </div>

        <Form {...form}>
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        orientation="vertical"
                        value={userType}
                        onValueChange={(value) => handleUserTypeSelection(value as 'STUDENT' | 'NON_STUDENT')}
                        className="mb-6"
                      >
                        <Radio classNames={{label : "black-text"}}  value="NON_STUDENT">Professional</Radio>
                        <Radio classNames={{label : "black-text"}} value="STUDENT">Student</Radio>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <p className="text-sm text-grey-2 mb-6">
              Note: This choice cannot be changed later.
            </p>
              <Button
                color="primary"
                size="lg"
                className="w-full font-medium text-lg text-white mt-4"
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className='space-y-6'>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          label="First Name"
                          placeholder="Enter your first name"
                          isRequired
                          
                          className="w-full p-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          label="Last Name"
                          placeholder="Enter your last name"
                          isRequired
                          className="w-full p-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {userType === 'STUDENT' && (
                  <>
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              label="Grade"
                              placeholder="Select your grade"
                              defaultSelectedKeys={form.getValues('grade') ? [form.getValues('grade')] : []}
                              className="w-full"
                              {...field}
                            >
                              <SelectItem key="4" value="4">
                                Grade 4
                              </SelectItem>
                              <SelectItem key="5" value="5">
                                Grade 5
                              </SelectItem>
                              <SelectItem key="6" value="6">
                                Grade 6
                              </SelectItem>
                              <SelectItem key="7" value="7">
                                Grade 7
                              </SelectItem>
                              <SelectItem key="8" value="8">
                                Grade 8
                              </SelectItem>
                              <SelectItem key="9" value="9">
                                Grade 9
                              </SelectItem>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <CustomDateInput
                              day={day}
                              month={month}
                              year={year}
                              onDayChange={setDay}
                              onMonthChange={setMonth}
                              onYearChange={setYear}
                              labelPlacement="top"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                </div>
                <div className="flex justify-between mt-8">
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
                    className="w-2/3 font-medium text-lg text-white"
                    isLoading={isPending}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </Form>
      </motion.div>
    </div>
  );
};

export default UserOnboarding;

