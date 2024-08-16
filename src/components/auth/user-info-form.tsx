'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Radio, RadioGroup, Button } from '@nextui-org/react';
import { updateUserMetadata } from '@/actions/auth/register';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import CardWrapper from '@/components/auth/card-wrapper';
import { User } from 'iconsax-react';
import { userSchema, UserFormData } from '@/schema';
import { useRouter } from 'next/navigation';
import { getLatestUserData } from '@/actions/auth/getLatestUserData';
import { useSession } from 'next-auth/react';
import CustomDateInput from './CustomDateInput';

const UserInfoForm: React.FC = () => {
  const [isPending, setIsPending] = useState(false);
  const [userType, setUserType] = useState<'STUDENT' | 'NON_STUDENT'>('STUDENT');
  const [latestUserData, setLatestUserData] = useState<any>(null);
  const router = useRouter();
  const { update } = useSession();

  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

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
      router.refresh();
      
      if (response.success) {
        
      } else {
        console.error('Failed to update user metadata:', response.error);
      }
    } catch (error) {
      console.error('Error updating user metadata:', error);
    } finally {
      setIsPending(false);
      router.refresh();
      await update();
      router.push('/beams-today')
    }
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
          </div>

          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full font-semibold text-white"
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
