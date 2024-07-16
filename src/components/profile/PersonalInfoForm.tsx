'use client';
import React, { useRef, useState, useTransition, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { SettingsSchema } from "@/schema";
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button, Input, Card, CardHeader, CardBody, Avatar } from "@nextui-org/react";
import { settings } from "@/actions/auth/settings";
import { changeProfileImage } from "@/actions/auth/user";
import { getCloudUrl } from "@/libs/cloudinary";

const PersonalInfoForm = ({ user }: { user: any }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isChangingImage, startChangingImage] = useTransition();
  const [cloudUrl, setCloudUrl] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string>(user.image || "");
  const fileInputRef = useRef<any>(null);

  useEffect(() => {
    const fetchCloudUrl = async () => {
      try {
        const url = await getCloudUrl();
        console.log("Cloudinary URL:", url); // Log the URL for debugging
        setCloudUrl(url);
      } catch (err) {
        console.error("Error fetching Cloudinary URL:", err);
      }
    };

    fetchCloudUrl();
  }, []);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && cloudUrl) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD || "");

      try {
        console.log("Uploading image to Cloudinary...");
        const res = await fetch(cloudUrl, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log("Cloudinary response:", data);

        if (data.secure_url) {
          startChangingImage(() => {
            changeProfileImage(data.secure_url)
              .then((res:any) => {
                console.log("Image URL saved to database:", data.secure_url);
                setProfileImage(data.secure_url);
                setSuccess(res);
                setError("");
              })
              .catch((err:any) => {
                console.error("Error saving image URL to database:", err);
                setError("Please Try Again");
              });
          });
        } else {
          console.error("Cloudinary upload failed:", data);
          setError("Cloudinary upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Error uploading image");
      }
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
        <div className="flex items-center justify-center mb-4">
          <Avatar
            src={profileImage}
            alt="Profile Picture"
            size="lg"
            color="primary"
            className="cursor-pointer"
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
            <Button type="submit" color="primary" className="w-full" isLoading={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </CardBody>
    </Card>
  );
};

export default PersonalInfoForm;
