'use client';
import React, { useRef, useState, useTransition } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { SettingsSchema } from "@/schema";
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button, Input, Card, CardHeader, CardBody, Avatar, Spinner } from "@nextui-org/react";
import { settings } from "@/actions/auth/settings";
import { changeProfileImage } from "@/actions/auth/user";
import { useUserStore } from "@/store/userStore";

interface PersonalInfoFormProps {
  user: {
    name: string | null | undefined;
    email: string;
    image: string;
  };
  url: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ user, url }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isChangingImage, startChangingImage] = useTransition();
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
      if (file && url) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD || "");

        setIsUploading(true);

        try {
          const res = await fetch(url, {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (data.secure_url) {
            await changeProfileImageHandler(data.secure_url);
          } else {
            setError("Cloudinary upload failed");
            setIsUploading(false);
          }
        } catch (error) {
          setError("Error uploading image");
          setIsUploading(false);
        }
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
    <Card className="w-full max-w-md shadow-lg mb-6">
      <CardHeader className="bg-primary-500 text-white">
        <p className="text-2xl font-semibold text-center">Edit Profile</p>
      </CardHeader>
      <CardBody>
        <div className="flex items-center justify-center mb-4 relative">
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
              <Spinner size="lg" color="primary" />
            </div>
          )}
          <Avatar
            src={profileImage}
            alt="Profile Picture"
            size="lg"
            color="primary"
            className={`cursor-pointer ${isUploading ? 'opacity-50' : ''}`}
            onClick={handleFileInputClick}
          />
          <Input
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
                  <FormItem>
                    <FormControl>
                      <Input
                        label="Name"
                        {...field}
                        disabled={isPending}
                        className="bg-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" color="primary" className="w-full text-white" isLoading={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </CardBody>
    </Card>
  );
};

export default PersonalInfoForm;
