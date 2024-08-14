'use client'
import React, { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Radio, RadioGroup, Button, DateInput } from '@nextui-org/react';
import { updateUserMetadata } from '@/actions/auth/register';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import CardWrapper from '@/components/auth/card-wrapper';
import { Calendar, User } from 'iconsax-react';
import { userSchema, UserFormData } from '@/schema';
import { useRouter } from 'next/navigation';
import { getLatestUserData } from '@/actions/auth/getLatestUserData';
import { useSession } from 'next-auth/react';
import { parseDate, CalendarDate } from '@internationalized/date'
const UserInfoForm: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [userType, setUserType] = useState<'STUDENT' | 'NON_STUDENT'>('STUDENT');
  const [latestUserData, setLatestUserData] = useState<any>(null); // State to store latest user data
  const router = useRouter();
  const { update } = useSession();

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
        console.log('Fetched user data:', data);
        if (data) {
          form.reset({
            userType: data.userType || 'STUDENT',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            grade: data.grade || '',
            dob: data.dob ? new Date(data.dob) : undefined,
          });
          setUserType(data.userType || 'STUDENT');
          setLatestUserData(data); // Store the latest user data in state
        }
      } catch (error) {
        console.error('Error fetching latest user data:', error);
      }
    };

    fetchLatestUserData();
  }, [form]);

  const onSubmit = (data: UserFormData) => {
    console.log('Submit function called with data:', data);

    startTransition(async () => {
      try {
        if (!latestUserData?.email) {
          throw new Error('Email not found.');
        }

        const values = {
          firstName: data.firstName,
          lastName: data.lastName,
          ...(data.userType === 'STUDENT' && {
            dob: data.dob || undefined,
            grade: data.grade,
          }),
          userType: data.userType,
          userFormCompleted: true,
        };

        console.log('Updating user metadata with values:', values);

        const response = await updateUserMetadata(latestUserData.email, values);
        console.log('Update response:', response);

        if (response.success) {
         
          console.log('User metadata updated successfully');
          console.log('Current pathname:', window.location.pathname);
          await update();
          router.refresh();
          router.push('/onboarding');
        } else {
          console.error('Failed to update user metadata:', response.error);
        }
      } catch (error) {
        console.error('Error updating user metadata:', error);
      }
      await update();
      router.refresh();
      router.push('/onboarding');
      
    });
  };

  return (
    <CardWrapper headerLabel="User Information">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    size="sm"
                    label="I am a"
                    orientation="horizontal"
                    onValueChange={(value: string) => {
                      field.onChange(value as 'STUDENT' | 'NON_STUDENT');
                      setUserType(value as 'STUDENT' | 'NON_STUDENT');
                    }}
                    value={field.value}
                  >
                    <Radio value="STUDENT">Student</Radio>
                    <Radio value="NON_STUDENT">Non-Student</Radio>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      labelPlacement="outside-left"
                      classNames={{
                        label: 'w-24 font-medium',
                        mainWrapper: 'w-full flex-1',
                        input: [
                          'placeholder:text-grey-2 text-xs',
                          'w-full flex-1 font-medium',
                        ],
                      }}
                      isRequired
                      label="First Name"
                      placeholder="Enter your first name"
                      startContent={<User className="text-default-400" size={16} />}
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
                      isRequired
                      labelPlacement="outside-left"
                      classNames={{
                        label: 'w-24 font-medium',
                        mainWrapper: 'w-full flex-1',
                        input: [
                          'placeholder:text-grey-2 text-xs',
                          'w-full flex-1 font-medium',
                        ],
                      }}
                      label="Last Name"
                      placeholder="Enter your last name"
                      startContent={<User className="text-default-400" size={16} />}
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
                        <Input
                          {...field}
                          isRequired
                          label="Grade"
                          labelPlacement="outside-left"
                          classNames={{
                            label: 'w-24 font-medium',
                            mainWrapper: 'w-full flex-1',
                            input: [
                              'placeholder:text-grey-2 text-xs',
                              'w-full flex-1 font-medium',
                            ],
                          }}
                          placeholder="Enter your grade"
                          startContent={<User className="text-default-400" size={16} />}
                        />
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
                        <DateInput
                          isRequired
                          labelPlacement="outside-left"
                          classNames={{
                            label: 'w-24 font-medium',
                            inputWrapper: 'w-full flex-1',
                            input: [
                              'placeholder:text-grey-2 text-xs',
                              'w-full flex-1 font-medium',
                            ],
                          }}
                          label="Date of Birth"
                          value={field.value ? parseDate(field.value.toISOString().split('T')[0]) : undefined}
                          onChange={(date: CalendarDate) => {
                            if (date) {
                              const jsDate = new Date(date.year, date.month - 1, date.day);
                              field.onChange(jsDate);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                          className="max-w-full w-full"
                          startContent={<Calendar />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full font-semibold"
            isLoading={isPending}
          >
            {isPending ? 'Saving...' : 'Next'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default UserInfoForm;
