"use client";
import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Radio, RadioGroup, Button, DatePicker, DateInput } from "@nextui-org/react";
import { updateUserMetadata } from "@/actions/auth/register";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import CardWrapper from "@/components/auth/card-wrapper";
import { Calendar, User } from "iconsax-react";
import { userSchema, UserFormData } from "@/schema";
import { parseDate, CalendarDate } from "@internationalized/date";
import { getLatestUserData } from "@/actions/auth/getLatestUserData";
import { useRouter } from "next/navigation";

const UserInfoForm: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [userType, setUserType] = useState<"STUDENT" | "NON_STUDENT">("STUDENT");
 const router = useRouter()
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onSubmit",
    defaultValues: {
      userType: "STUDENT", // Default to "STUDENT"
      firstName: "",
      lastName: "",
      grade: "",
      dob: undefined,
    },
  });

  useEffect(() => {
    const fetchLatestUserData = async () => {
      try {
        const latestUserData = await getLatestUserData();
        console.log(latestUserData)
        if (latestUserData) {
          form.reset({
            userType: "STUDENT", // Always default to STUDENT
            firstName: latestUserData.firstName || "",
            lastName: latestUserData.lastName || "",
            grade: latestUserData.grade || "",
            dob: latestUserData.dob ? new Date(latestUserData.dob) : undefined,
          });
          setUserType("STUDENT"); // Force to "STUDENT"
        }
      } catch (error) {
        console.error("Error fetching latest user data:", error);
      }
    };

    fetchLatestUserData();
  }, [form]);

  const onSubmit = async (data: UserFormData) => {
    startTransition(async () => {
      try {
        const latestUserData = await getLatestUserData();
      
        const email = latestUserData?.email;
        
        if (!email) {
          throw new Error("Email not found.");
        }

        const values = {
          firstName: data.firstName,
          lastName: data.lastName,
          ...(data.userType === "STUDENT" && {
            dob: data.dob ? data.dob : undefined,
            grade: data.grade,
          }),
          userType: data.userType,
        };

        const response = await updateUserMetadata(email, values);
        if (response.success) {
          
          console.log('start routing')

          router.push('/onboarding');
          console.log('finished routing')
        } else {
          console.error("Failed to update user metadata:", response.error);
        }
        router.push('/onboarding');
      } catch (error) {
        console.error("Error updating user metadata:", error);
      }
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
                      field.onChange(value as "STUDENT" | "NON_STUDENT");
                      setUserType(value as "STUDENT" | "NON_STUDENT");
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
                        mainWrapper: "w-full flex-1",
                        input: [
                          "placeholder:text-grey-2 text-xs",
                          'w-full flex-1 font-medium'
                        ]
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
                        mainWrapper: "w-full flex-1",
                        input: [
                          "placeholder:text-grey-2 text-xs",
                          'w-full flex-1 font-medium'
                        ]
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

            {userType === "STUDENT" && (
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
                            mainWrapper: "w-full flex-1",
                            input: [
                              "placeholder:text-grey-2 text-xs",
                              'w-full flex-1 font-medium'
                            ]
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
                            inputWrapper: "w-full flex-1",
                            input: [
                              "placeholder:text-grey-2 text-xs",
                              'w-full flex-1 font-medium'
                            ]
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
            {isPending ? "Saving..." : "Next"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default UserInfoForm;
