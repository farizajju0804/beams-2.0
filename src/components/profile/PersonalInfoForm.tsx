'use client';
import React, { useRef, useState, useTransition } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button, Input, Card, CardBody, Spinner, Select, SelectItem, Avatar } from "@nextui-org/react";
import { DatePicker } from "@nextui-org/react";
import { parseDate, CalendarDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { settings } from "@/actions/auth/settings";
import { changeProfileImage } from "@/actions/auth/user";
import { useUserStore } from "@/store/userStore";
import { Gallery, Edit2 } from "iconsax-react";
import { z } from "zod";
import toast, { Toaster } from 'react-hot-toast';
import { v2 as cloudinary } from 'cloudinary';
import { sha1 } from 'crypto-hash';
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

const grades = ['Grade 4','Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];

export const SettingsSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  gender: z.enum(['MALE', 'FEMALE', 'TRANSGENDER', 'BISEXUAL', 'PREFER_NOT_TO_SAY']),
  dob: z.instanceof(CalendarDate).nullable().optional(),
  grade: z.string().optional().nullable(),
  schoolName: z.string().optional().nullable(),
  userType: z.enum(["STUDENT", "NON_STUDENT"]),
  email: z.string().email().optional(),
});

export type SettingsFormData = z.infer<typeof SettingsSchema>;

interface PersonalInfoFormProps {
  user: {
    id: string | undefined;
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
      dob: user.dob ? parseDate(user.dob.toISOString().split("T")[0]) : null,
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
      toast.success("Profile image updated successfully", { position: 'top-center' });
    } catch (err) {
      toast.error("Failed to update profile image. Please try again.", { position: 'top-center' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      // File type and size checks remain the same
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, or GIF)", { position: 'top-center' });
        return;
      }
  
      const maxSize = 200 * 1024;
      if (file.size > maxSize) {
        toast.error("File size exceeds 200KB. Please choose a smaller image.", { position: 'top-center' });
        return;
      }
  
      setIsUploading(true);
  
      try {
        const timestamp = Math.round((new Date()).getTime() / 1000);
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD || "";
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "";
        const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || "";
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
        
        // Generate signature
        const publicId = `user_${user.id}_profile`;
        const paramsToSign = {
          timestamp: timestamp,
          upload_preset: uploadPreset,
          public_id: publicId,
          overwrite: true
        };
        
        const signaturePayload = Object.entries(paramsToSign)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => `${key}=${value}`)
          .join('&') + apiSecret;

        const signature = await sha1(signaturePayload);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("upload_preset", uploadPreset);
        formData.append("public_id", publicId);
        formData.append("overwrite", "true");
  
        const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });
  
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("Cloudinary API error:", uploadResponse.status, errorText);
          throw new Error(`Cloudinary API error: ${uploadResponse.status} ${errorText}`);
        }
  
        const uploadResult = await uploadResponse.json();
  
        if (uploadResult.secure_url) {
          await changeProfileImageHandler(uploadResult.secure_url);
        } else {
          console.error("Unexpected Cloudinary response:", uploadResult);
          throw new Error("Unexpected Cloudinary response");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        if (error instanceof Error) {
          toast.error(`Error uploading image: ${error.message}`, { position: 'top-center' });
        } else {
          toast.error("An unexpected error occurred while uploading the image", { position: 'top-center' });
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onSubmit = (values: SettingsFormData) => {
    let dob = values.dob ? new Date(Date.UTC(values.dob.year, values.dob.month - 1, values.dob.day, 0, 0, 0)) : null;
    const updatedValues = { ...values, dob };
    startTransition(() => {
      settings(updatedValues)
        .then((data) => {
          if (data.error) {
            toast.error(data.error, { position: 'top-center' });
          } else if (data.success) {
            toast.success(data.success, { position: 'top-center' });
            setUser(values);
            setIsEditing(true);
          }
        })
        .catch(() => {
          toast.error("Something went wrong", { position: 'top-center' });
        });
    });
  };

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const formatter = useDateFormatter({ dateStyle: "full" });
  const maxDate = parseDate('2018-12-31');
  const minDate = parseDate('1900-01-01');

  return (
    <>
    <Toaster />
    <Card className="w-full max-w-lg p-0 border-0 mb-6 shadow-none">
      <CardBody className="border-0 shadow-none">
      <div className="flex items-center justify-center mb-2 relative">
          {isUploading ? (
            <div className="z-[40] flex items-center justify-center bg-background bg-opacity-75 rounded-full">
              <Spinner size="lg" color="primary" />
            </div>
          ) : 
          <div className="relative">
          <div className="w-24 h-24 mb-2 rounded-full overflow-hidden flex items-center justify-center cursor-pointer" onClick={handleFileInputClick}>
            <Avatar 
              src={profileImage}
              showFallback
              
              isBordered
              alt="Profile" 
              className="w-24 h-24 text-large"
            />
            <div className="absolute bottom-1 right-0 bg-brand p-1 flex items-center justify-center z-[30] rounded-full">
              <Gallery size={16} className="text-white" />
            </div>
          </div>
        </div>}
         
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
          {/* {(error || success) && (
            <div className="my-3 text-center">
              {error && <FormError message={error} />}
              {success && <FormSuccess message={success} />}
            </div>
          )} */}
          
        <Button
            color="primary"
            variant="light"
            startContent={<Edit2 size={18} />}
            className={`mb-4 mx-auto `}
            onClick={toggleEditing}
          >
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </Button>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex items-start flex-col justify-center space-x-4">
                    <FormControl>
                      <Input {...field} label="First Name" isDisabled={!isEditing || isPending} />
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
                      <Input {...field} label="Last Name" isDisabled={!isEditing || isPending} />
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
                        isDisabled={!isEditing || isPending}
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
                            defaultSelectedKeys={user.grade ? [user.grade] : []}
                            placeholder="Select your grade"
                            isDisabled={!isEditing || isPending}
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
                            isDisabled={!isEditing || isPending}
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
                            minValue={minDate}
                            onClick={handleCalendarClick}
                            defaultValue={field.value ? parseDate(field.value.toString()) : undefined}
                            value={field.value ? parseDate(field.value.toString()) : null}
                            onChange={field.onChange}
                            showMonthAndYearPickers
                            calendarProps={{
                              calendarWidth: 256,
                              classNames: {
                                gridWrapper: "w-full",
                                content: 'w-[256px]'
                              }
                            }}
                            classNames={{
                              calendarContent: 'w-[256px]'
                            }}
                            className="border-none m-0 min-w-full"
                            isDisabled={!isEditing || isPending}
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
                        <Input label="Email" value={user.email} isDisabled />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            {isEditing && (
              <Button type="submit" color="primary" className="w-full font-medium text-lg text-white" isLoading={isPending}>
                Save Changes
              </Button>
            )}
            {/* {error && !isUploading && <FormError message={error} />}
            {success && !isUploading && <FormSuccess message={success} />} */}
          </form>
        </Form>
      </CardBody>
    </Card>
    </>
  );
};

export default PersonalInfoForm;