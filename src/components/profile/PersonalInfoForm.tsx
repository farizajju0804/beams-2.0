'use client';
import React, { useRef, useState, useTransition, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button, Input, Card, CardHeader, CardBody, Spinner, Select, SelectItem, Avatar } from "@nextui-org/react";
import { DatePicker } from "@nextui-org/react";
import { parseDate, getLocalTimeZone, CalendarDate, DateValue } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { settings } from "@/actions/auth/settings";
import { changeProfileImage } from "@/actions/auth/user";
import { useUserStore } from "@/store/userStore";
import { Gallery } from "iconsax-react";
import { z } from "zod";

const genders = [
  { title: 'Male', name: 'MALE' },
  { title: 'Female', name: 'FEMALE' },
  { title: 'Transgender', name: 'TRANSGENDER' },
  { title: 'Bisexual', name: 'BISEXUAL' },
  { title: 'Prefer Not to Say', name: 'PREFER_NOT_TO_SAY' },
];

const schools = [
  'Lowell High School',
  'Washington High School',
  'Galileo Academy',
  'Balboa High School',
  'Mission High School'
];

const grades = ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];

export const SettingsSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  gender: z.enum(['MALE', 'FEMALE', 'TRANSGENDER', 'BISEXUAL', 'PREFER_NOT_TO_SAY']),
  dob: z.instanceof(CalendarDate).nullable().optional(), // Use CalendarDate from @internationalized/date
  grade: z.string().optional().nullable(),
  schoolName: z.string().optional().nullable(),
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
    gender?: 'MALE' | 'FEMALE' | 'TRANSGENDER' | 'BISEXUAL' | 'PREFER_NOT_TO_SAY';
    dob?: Date;
    grade?: string;
    schoolName?: string;
  };
  isOAuth: boolean;
}

const getAvatarSrc = (user: any) => user?.image;

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

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      gender: user.gender,
      userType: user.userType,
      grade: user.grade || undefined,
      schoolName: user.schoolName || undefined,
      email: user.email,
      dob: user.dob ? parseDate(user.dob.toISOString().split("T")[0]) : null, // Using parseDate for DateValue
    },
  });

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
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

  const onSubmit = (values: SettingsFormData) => {
    setError(undefined);
    setSuccess(undefined);
    let dob = values.dob ? new Date(Date.UTC(values.dob.year, values.dob.month - 1, values.dob.day, 0, 0, 0)) : null;
  const updatedValues = { ...values, dob };
    startTransition(() => {
      settings(updatedValues)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else if (data.success) {
            setSuccess(data.success);
            setUser(values);
          }
        })
        .catch(() => {
          console.error(error)
          setError("Something went wrong")
          }
      );
    });
  };

  const formatter = useDateFormatter({ dateStyle: "full" });
  const maxDate = parseDate('2016-12-31');
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
            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center cursor-pointer" onClick={handleFileInputClick}>
              <Avatar 
                src={profileImage}
                showFallback
                isBordered
                alt="Profile" 
                className="w-24 h-24 text-large"
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex items-start flex-col justify-center space-x-4">
                    <FormControl>
                      <Select
                        {...field}
                        label="Gender"
                        defaultSelectedKeys={user.gender ? [user.gender] : ""}
                        value={field.value}
                        disabled={isPending}
                      >
                        {genders.map((gender) => (
                          <SelectItem key={gender.name} value={gender.name}>
                            {gender.title}
                          </SelectItem>
                        ))}
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
                  <FormItem className="w-full">
                    <FormControl>
                      <DatePicker
                        label="Birth Date"
                        calendarWidth={256}
                        maxValue={maxDate}
                        defaultValue={field.value ? parseDate(field.value.toString()) : undefined}
                        value={field.value ? parseDate(field.value.toString()) : null}
                        onChange={field.onChange}
                        showMonthAndYearPickers
                        calendarProps={{
                          calendarWidth : 256,
                          classNames : {
                            gridWrapper : "w-full",
                            content: 'w-[256px]'
                          }
                        }}
                        classNames={
                          {
                            calendarContent : 'w-[256px]'
                          }
                        }
                        className="border-none m-0 min-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {userType === "STUDENT" && (
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
                        defaultSelectedKeys={user.grade ? [user.grade] : []}
                        placeholder="Select your grade"
                        disabled={isPending}
                      >
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              )}
              {userType === "STUDENT" && (
                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem className="flex items-start flex-col justify-center space-x-4">
                      <FormControl>
                        <Select
                          {...field}
                          label="School Name"
                          value={field.value || undefined}
                          defaultSelectedKeys={user.schoolName ? [user.schoolName] : []}
                          disabled={isPending}
                        >
                         {schools.map((school) => (
                          <SelectItem key={school} value={school}>
                            {school}
                          </SelectItem>
                        ))}
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
            {error && <FormError message={error} /> }
            {success && <FormSuccess message={success} />}
          </form>
        </Form>
      </CardBody>
    </Card>
  );
};

export default PersonalInfoForm;
