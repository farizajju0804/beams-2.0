'use client';
import React, { useRef, useState, useTransition } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { SettingsSchema } from "@/schema";
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button, Input, Card, CardHeader, CardBody, Spinner } from "@nextui-org/react";
import { settings } from "@/actions/auth/settings";
import { changeProfileImage } from "@/actions/auth/user";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { Gallery } from "iconsax-react";

interface PersonalInfoFormProps {
  user: {
    name: string | null | undefined;
    email: string;
    image: string;
    isOAuth: boolean;
  };
  url: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ user, url }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [profileImage, setProfileImage] = useState<string>(user.image || "");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const updateUserImage = useUserStore((state) => state.updateUserImage);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || '',
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

      // Create formData and append file and necessary Cloudinary parameters
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

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
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
                name="name"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-center space-x-4">
                    <div className="w-10 flex items-center justify-center">
                      <label className="text-sm text-text">Name:</label>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user.isOAuth && (
                <FormField
                  control={form.control}
                  name="email"
                  render={() => (
                    <FormItem className="flex items-center justify-center space-x-4">
                      <div className="w-10 flex items-center justify-center">
                        <label className="text-sm text-text">Email:</label>
                      </div>
                      <FormControl>
                        <Input
                          value={user.email}
                          disabled
                        />
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
