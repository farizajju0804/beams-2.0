'use client';
import React, { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { Button, Input, Card, CardBody, Spinner, Select, SelectItem, Avatar } from "@nextui-org/react";
import { DatePicker } from "@nextui-org/react";
import { parseDate, CalendarDate } from "@internationalized/date";
import { settings } from "@/actions/auth/settings";
import { changeProfileImage } from "@/actions/auth/user";
import { useUserStore } from "@/store/userStore";
import { Gallery, Edit2 } from "iconsax-react";
import { z } from "zod";
import toast, { Toaster } from 'react-hot-toast';
import { getSchools } from "@/actions/auth/onboarding";
import { School } from "@prisma/client";

// Define available gender options for the dropdown
const genders = [
  { title: 'Male', name: 'MALE' },
  { title: 'Female', name: 'FEMALE' },
  { title: 'Transgender', name: 'TRANSGENDER' },
  { title: 'Bisexual', name: 'BISEXUAL' },
  { title: 'Prefer Not to Say', name: 'PREFER_NOT_TO_SAY' },
];

// Define available grade options
const grades = ['Grade 4','Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];

// Zod schema for form validation
export const SettingsSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(20, "First name cannot exceed 20 characters")
    .trim()
    .refine(
      (val) => /^[a-zA-Z0-9\s]+$/.test(val),
      "First name can only contain letters, numbers and spaces"
    ),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(20, "Last name cannot exceed 20 characters")
    .trim()
    .refine(
      (val) => /^[a-zA-Z0-9\s]+$/.test(val),
      "Last name can only contain letters, numbers and spaces"
    ),
  gender: z.enum(['MALE', 'FEMALE', 'TRANSGENDER', 'BISEXUAL', 'PREFER_NOT_TO_SAY']),
  dob: z.instanceof(CalendarDate).nullable().optional(),
  grade: z.string().optional().nullable(),
  schoolId: z.string().optional().nullable(),
  userType: z.enum(["STUDENT", "NON_STUDENT"]),
  email: z.string().email().optional(),
});

// Type definition for form data based on the Zod schema
export type SettingsFormData = z.infer<typeof SettingsSchema>;

// Props interface for the PersonalInfoForm component
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
    schoolId?: string;
  };
  isOAuth: boolean;
}

// Helper function to get avatar source URL
const getAvatarSrc = (user: any) => user?.image;

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ user, isOAuth }) => {
  // State management using React hooks
  const [isPending, startTransition] = useTransition();
  const [profileImage, setProfileImage] = useState<string>(getAvatarSrc(user));
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [userType, setUserType] = useState<"STUDENT" | "NON_STUDENT">(user.userType);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Get functions from user store
  const updateUserImage = useUserStore((state) => state.updateUserImage);
  const setUser = useUserStore((state) => state.setUser);
  const [schools, setSchools] = useState<School[]>([]);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      gender: user.gender,
      userType: user.userType,
      grade: user.grade || undefined,
      schoolId: user.schoolId || undefined,
      email: user.email,
      dob: user.dob ? parseDate(user.dob.toISOString().split("T")[0]) : null,
    },
  });

  // Fetch schools data on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schoolData: School[] = await getSchools();
        setSchools(schoolData);
      } catch (error) {
        console.error('Error fetching schools:', error);
        toast.error('Failed to load schools', { position: 'top-center' });
      }
    };

    fetchSchools();
  }, []);

  // Handle file input click for profile image upload
  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle profile image change in the backend and UI
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

  // Generate SHA-1 hash for Cloudinary signature
  function sha1(str: string) {
    const utf8 = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-1', utf8).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    });
  }

  // Handle file selection and upload to Cloudinary
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, or GIF)", { position: 'top-center' });
        return;
      }
  
      const maxSize = 200 * 1024; // 200KB
      if (file.size > maxSize) {
        toast.error("File size exceeds 200KB. Please choose a smaller image.", { position: 'top-center' });
        return;
      }
  
      setIsUploading(true);
  
      try {
        // Prepare Cloudinary upload parameters
        const timestamp = Math.round((new Date()).getTime() / 1000);
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD || "";
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "";
        const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || "";
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
        
        // Generate signature for secure upload
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

        // Prepare form data for upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("upload_preset", uploadPreset);
        formData.append("public_id", publicId);
        formData.append("overwrite", "true");
  
        // Upload to Cloudinary
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

  // Handle form submission
  const onSubmit = (values: SettingsFormData) => {
    // Convert date to UTC
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

  // Prevent calendar click event propagation
  const handleCalendarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // Set date picker constraints
  const maxDate = parseDate('2018-12-31');
  const minDate = parseDate('1900-01-01');

  // Render component
  return (
    <>
    <Toaster />
    <Card className="w-full max-w-lg p-0 border-0 mb-6 shadow-none">
      <CardBody className="border-0 shadow-none">
        {/* Profile Image Section */}
        <div className="flex items-center justify-center mb-2 relative">
          {isUploading ? (
            <div className="z-[40] flex items-center justify-center bg-background bg-opacity-75 rounded-full">
              <Spinner size="lg" color="primary" />
            </div>
          ) : 
          <div className="relative">
            <div className="w-24 h-24 mb-2 rounded-full overflow-hidden flex items-center justify-center cursor-pointer" 
                 onClick={handleFileInputClick}>
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
            aria-label="profile"
            autoComplete="profile"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
     
        {/* Edit Profile Button */}
        <Button
          color="primary"
          variant="light"
          aria-label="edit"
          startContent={<Edit2 size={18} />}
          className={`mb-4 mx-auto `}
          onClick={toggleEditing}
        >
          {isEditing ? "Cancel Editing" : "Edit Profile"}
        </Button>

        {/* Form Section */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* First Name Field */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex items-start flex-col justify-center space-x-4">
                    <FormControl>
                      <Input
                        aria-label="first-name"
                        autoComplete="first-name"
                        {...field} 
                        label="First Name" 
                        isDisabled={!isEditing || isPending} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name Field */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex items-start flex-col justify-center space-x-4">
                    <FormControl>
                      <Input
                        aria-label="last-name"
                        autoComplete="last-name"
                        {...field} 
                        label="Last Name" 
                        isDisabled={!isEditing || isPending} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender Selection Field */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex items-start flex-col justify-center space-x-4">
                    <FormControl>
                      <Select
                        {...field}
                        label="Gender"    
                        aria-label="gender"
                        autoComplete="gender"
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
             
               {/* Show fields only for updating if the user is student */}
              {userType === "STUDENT" && (
                <>
               {/* Grade Field */}
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem className="flex items-start flex-col justify-center space-x-4">
                        <FormControl>
                          <Select
                            {...field}
                            label="Grade"
                             aria-label="grade"
                      autoComplete="grade"
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
               {/* SchoolName Field */}
                   <FormField
                    control={form.control}
                    name="schoolId"
                    render={({ field }) => (
                      <FormItem className="flex items-start flex-col justify-center space-x-4">
                        <FormControl>
                          <Select
                            {...field}
                            label="School Name"
                             aria-label="school"
                      autoComplete="school"
                            value={field.value || undefined}
                            defaultSelectedKeys={user.schoolId ? [user.schoolId] : []}
                            isDisabled={!isEditing || isPending || schools.length === 0}
                          >
                            {schools.map((school) => (
                              <SelectItem key={school.id} value={school.id}>
                                {school.name}
                              </SelectItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               {/* DOB Field */}
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
                            aria-label="dob"
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
               {/* Show and disbale email input for o-auth users */}
              {isOAuth && (
                <FormField
                  control={form.control}
                  name="email"
                  render={() => (
                    <FormItem className="flex items-start flex-col justify-center space-x-4">
                      <FormControl>
                        <Input aria-label="email" label="Email" value={user.email} isDisabled />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            {isEditing && (
              <Button aria-label="submit"  type="submit" color="primary" className="w-full font-medium text-lg text-white" isLoading={isPending}>
                Save Changes
              </Button>
            )}

          </form>
        </Form>
      </CardBody>
    </Card>
    </>
  );
};

export default PersonalInfoForm;