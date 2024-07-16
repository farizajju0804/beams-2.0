// components/UserProfile.tsx
'use server'
import React from "react";
import PersonalInfoForm from "@/components/profile/PersonalInfoForm";
import ChangeEmailForm from "@/components/profile/ChangeEmailForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

const UserProfile = ({ user }: { user: any }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-8">
      <PersonalInfoForm user={user} />
      {!user.isOAuth && <ChangeEmailForm user={user} />}
      {!user.isOAuth && <ChangePasswordForm />}
    </div>
  );
};

export default UserProfile;
