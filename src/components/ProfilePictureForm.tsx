'use client'
import React, { useRef, useState } from "react";
import { Avatar, Spinner } from "@nextui-org/react";
import { Edit2} from "iconsax-react";
import { Toaster, toast } from "react-hot-toast";
import { changeProfileImage } from "@/actions/auth/user";
import { useUserStore } from "@/store/userStore";
import { uploadToCloudinary } from "@/libs/cloudinary";

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


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    setIsUploading(true);
  
    try {
      // Create FormData to pass to server action
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);
  
      const result = await uploadToCloudinary(formData);
      
      if (result.error) {
        toast.error(result.error, { position: 'top-center' });
        return;
      }
  
      if (result.secure_url) {
        await handleImageUpdate(result.secure_url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An unexpected error occurred while uploading the image", { position: 'top-center' });
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
                <Edit2 variant="Bold" size={14} className="text-white" />
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
        <h2 className="text-base text-wrap w-full truncate text-center md:text-2xl font-poppins font-medium">{user.firstName} {user.lastName}</h2>
      </div>
    </>
  );
};

export default ProfilePictureForm;