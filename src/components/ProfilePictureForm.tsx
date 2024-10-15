'use client'
import React, { useRef, useState } from "react";
import { Avatar, Spinner } from "@nextui-org/react";
import { Gallery } from "iconsax-react";
import { Toaster, toast } from "react-hot-toast";
import { changeProfileImage } from "@/actions/auth/user";
import { useUserStore } from "@/store/userStore";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
}

interface ProfilePictureProps {
  user: User;
}

const ProfilePictureForm: React.FC<ProfilePictureProps> = ({ user }) => {
  const [profileImage, setProfileImage] = useState<string>(user.image);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateUserImage = useUserStore((state) => state.updateUserImage);
  const setUser = useUserStore((state) => state.setUser);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleImageUpdate = async (url: string) => {
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

  async function sha1(str: string) {
    const utf8 = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
        await handleImageUpdate(uploadResult.secure_url);
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
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          {isUploading ? (
            <div className="w-24 h-24 flex items-center justify-center bg-background bg-opacity-75 rounded-full">
              <Spinner size="lg" color="primary" />
            </div>
          ) : (
            <div className="w-24 h-24 mb-2 rounded-full overflow-hidden flex items-center justify-center cursor-pointer" onClick={handleFileInputClick}>
              <Avatar 
                src={profileImage}
                showFallback
                isBordered
                alt="Profile" 
                className="w-24 h-24 text-large"
              />
              <div className="absolute bottom-2 right-1 bg-primary p-1 flex items-center justify-center z-[30] rounded-full">
                <Gallery variant="Bold" size={16} className="text-white" />
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif"
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-poppins font-bold mt-2">{user.firstName} {user.lastName}</h2>
      </div>
    </>
  );
};

export default ProfilePictureForm;