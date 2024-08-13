'use client';
import React, { useRef, useState, useTransition } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button, Input, Card, CardHeader, CardBody, Spinner, DateInput } from "@nextui-org/react";
import { settings } from "@/actions/auth/settings";
import { changeProfileImage } from "@/actions/auth/user";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { Calendar, Gallery } from "iconsax-react";
import { SettingsSchema, SettingsFormData } from "@/schema";
import { parseDate, CalendarDate } from '@internationalized/date'

interface PersonalInfoFormProps {
  user: {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string;
    image: string;
    userType: "STUDENT" | "NON_STUDENT";
    dob?: Date;
    grade?: string;
  };
  isOAuth : boolean
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ user },isOAuth) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [profileImage, setProfileImage] = useState<string>(user.image || "");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [userType, setUserType] = useState<"STUDENT" | "NON_STUDENT">(user.userType);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const updateUserImage = useUserStore((state) => state.updateUserImage);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      grade: user.grade || '',
      dob: user.dob ? new Date(user.dob) : undefined,
      email: user.email,
    },
  });

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input value to ensure onChange is triggered
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD || "");

      setIsUploading(true);

      try {
        const uploadResult = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData,
        }).then(res => res.json());

        if (uploadResult.secure_url) {
          await changeProfileImageHandler(uploadResult.secure_url);
        } else {
          setError("Cloudinary upload failed");
        }
      } catch (error) {
        setError("Error uploading image");
      } finally {
        setIsUploading(false);
      }
    } else {
      console.error("No files selected.");
    }
  };

  const changeProfileImageHandler = async (url: string) => {
    try {
      await changeProfileImage(url);
      setProfileImage(url);
      updateUserImage(url); // Update the image in the Zustand store
      setSuccess("Profile image updated successfully");
      setError("");
    } catch (err) {
      setError("Please try again");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (values: SettingsFormData) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else if (data.success) {
            setSuccess(data.success);
            setError("");
          }
        })
        .catch(() => { setError("Something went wrong") });
    });
  };

  return (
    <Card className="w-full max-w-md p-4 border-0 rounded-3xl shadow-lg mb-6">
      <CardHeader className="text-text">
        <p className="text-base lg:text-xl font-semibold text-center">Edit Profile</p>
      </CardHeader>
      <CardBody className="border-0 shadow-none">
        <div className="flex items-center justify-center mb-4 relative">
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background bg-opacity-75 rounded-full">
              <Spinner size="lg" color="primary" />
            </div>
          )}
          <div className="relative">
            <div
              className={`w-24 h-24 rounded-full overflow-hidden flex items-center justify-center cursor-pointer  ${isUploading ? 'opacity-50' : ''}`}
              onClick={handleFileInputClick}
            >
              <Image src={profileImage ? profileImage : 'https://placehold.co/200'} alt="Profile" width={200} height={200} className="w-full h-full rounded-full border-1 border-brand object-cover" />
              <div className="absolute bottom-0 right-0 bg-brand p-1 flex items-center justify-center z-[30] rounded-full">
                <Gallery size={16} className="text-white" />
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-center space-x-4">
                    <div className="w-24 flex items-center justify-center">
                      <label className="text-sm text-text">First Name:</label>
                    </div>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-center space-x-4">
                    <div className="w-24 flex items-center justify-center">
                      <label className="text-sm text-text">Last Name:</label>
                    </div>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
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
                      <FormItem className="flex items-center justify-center space-x-4">
                        <div className="w-24 flex items-center justify-center">
                          <label className="text-sm text-text">Grade:</label>
                        </div>
                        <FormControl>
                          <Input {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-center space-x-4">
                        <div className="w-24 flex items-center justify-center">
                          <label className="text-sm text-text">DOB:</label>
                        </div>
                        <FormControl>
                        <DateInput
                          isRequired
                          labelPlacement="outside-left"
                          classNames={{
                            // label: 'w-24 font-medium',
                            inputWrapper: 'w-full flex-1',
                            input: [
                              'placeholder:text-grey-2 text-xs',
                              'w-full flex-1 font-medium',
                            ],
                          }}
                          
                          value={field.value ? parseDate(field.value.toISOString().split('T')[0]) : undefined}
                          onChange={(date: CalendarDate) => {
                            if (date) {
                              const jsDate = new Date(date.year, date.month - 1, date.day)
                              field.onChange(jsDate)
                            } else {
                              field.onChange(undefined)
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
              {isOAuth && (
                <FormField
                  control={form.control}
                  name="email"
                  render={() => (
                    <FormItem className="flex items-center justify-center space-x-4">
                      <div className="w-24 flex items-center justify-center">
                        <label className="text-sm text-text">Email:</label>
                      </div>
                      <FormControl>
                        <Input value={user.email} disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" color="primary" className="w-full font-medium text-white" isLoading={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </CardBody>
    </Card>
  );
};

export default PersonalInfoForm;
