'use client';
import React, { useRef, useState, useTransition, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button, Input, Card, CardHeader, CardBody, Spinner, Select, SelectItem } from "@nextui-org/react";
import { settings } from "@/actions/auth/settings";
import { changeProfileImage } from "@/actions/auth/user";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { Gallery } from "iconsax-react";
import { z } from "zod";
import CustomDateInput from "../auth/CustomDateInput";

export const SettingsSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  dob: z.date().optional().nullable(),
  grade: z.string().optional().nullable(),
  userType: z.enum(["STUDENT", "NON_STUDENT"]),
  email: z.string().email().optional(),
});

export type SettingsFormData = z.infer<typeof SettingsSchema>;

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
  isOAuth: boolean;
}

const getAvatarSrc = (user: any) => user?.image || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(`${user?.firstName || ''} ${user?.lastName || ''}`)}`;

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ user, isOAuth }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [profileImage, setProfileImage] = useState<string>(getAvatarSrc(user));
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [userType, setUserType] = useState<"STUDENT" | "NON_STUDENT">(user.userType);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const updateUserImage = useUserStore((state) => state.updateUserImage);
  const setUser = useUserStore((state) => state.setUser);

  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      userType: user.userType,
      grade: user.grade || undefined,
      email: user.email,
      dob: user.dob,
    },
  });

  useEffect(() => {
    if (user.dob) {
      const date = new Date(user.dob);
      setDay(date.getDate().toString().padStart(2, '0'));
      setMonth((date.getMonth() + 1).toString().padStart(2, '0'));
      setYear(date.getFullYear().toString());
    }
  }, [user.dob]);

  const handleDateChange = () => {
    if (day && month && year) {
      const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(newDate.getTime())) {
        form.setValue('dob', newDate); // Set the dob in form state
      } else {
        form.setValue('dob', undefined); // Reset if the date is invalid
      }
    }
  };

  useEffect(() => {
    handleDateChange();
  }, [day, month, year]);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      updateUserImage(url);
      setUser({ ...useUserStore.getState().user, image: url });
      setSuccess("Profile image updated and saved successfully");
      setError("");
    } catch (err) {
      setError("Please try again");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (values: SettingsFormData) => {
    setError(undefined);
    setSuccess(undefined); 
    startTransition(() => {
      
      settings(values)
        .then((data) => {
          console.log("Settings Response:", data); // Add this line
          if (data.error) {
            setError(data.error);
            setSuccess("");
          } else if (data.success) {
            setSuccess(data.success);
          console.log("success:", success);
            setError("");
            setUser(values); 
          }
        })
        .catch((err) => {
          console.error("Error submitting form:", err);
          setError("Something went wrong");
          setSuccess("");
        });
    });
  };
  
  return (
    <Card className="w-full max-w-lg p-0 border-0 mb-6 shadow-none">
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
              <Image 
                src={profileImage}
                alt="Profile" 
                width={200} 
                height={200} 
                className="w-full h-full rounded-full border-1 border-brand object-cover" 
              />
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
        <form onSubmit={(e) => { 
      console.log("Form is being submitted"); 
      form.handleSubmit(onSubmit)(e);
    }} 
    className="space-y-6"
  >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex items-start flex-col justify-center space-x-4">
                    
                    <FormControl>
                      <Input {...field} label="First Name" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex items-start flex-col justify-center space-x-4">
                    
                    <FormControl>
                      <Input {...field} label="Last Name" disabled={isPending} />
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
                      <FormItem className="flex items-start flex-col justify-center space-x-4">
                        
                        <FormControl>
                          <Select
                            {...field}
                            label="Grade"
                            value={field.value || undefined}
                            placeholder="Select your grade"
                            disabled={isPending}
                            defaultSelectedKeys={user.grade ? [user.grade] : undefined}
                          >
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
                      <FormItem className="flex items-start flex-col justify-center space-x-4">
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
              {isOAuth && (
                <FormField
                  control={form.control}
                  name="email"
                  render={() => (
                    <FormItem className="flex items-start flex-col justify-center space-x-4">
                      
                      <FormControl>
                        <Input label="Email" value={user.email} disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            <Button type="submit" color="primary" className="w-full font-medium text-lg text-white" isLoading={isPending}>
              Save
            </Button>
            <FormError message={error} />
            <FormSuccess message={success} />
          </form>
        </Form>
      </CardBody>
    </Card>
  );
};

export default PersonalInfoForm;
