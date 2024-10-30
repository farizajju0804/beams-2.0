'use client';
import React from "react";
import PersonalInfoForm from "@/app/my-profile/_components/PersonalInfoForm";
import ChangeEmailForm from "@/app/my-profile/_components/ChangeEmailForm";
import ChangePasswordForm from "@/app/my-profile/_components/ChangePasswordForm";
import TwoFactorAuthForm from "./2FAForm";
import {Tabs, Tab} from "@nextui-org/react";

const UserProfile = ({ user, isOAuth }: { user: any, isOAuth: any }) => {
  const tabs = [
    {
      id: "personal",
      label: "Personal Info",
      content: <PersonalInfoForm user={user} isOAuth={isOAuth} />
    },
    ...(!isOAuth ? [{
      id: "security",
      label: "Security",
      content: (
        <div className="w-full flex items-center gap-8 justify-center flex-col">
          <ChangeEmailForm user={user} />
          <ChangePasswordForm />
          <TwoFactorAuthForm user={user} />
        </div>
      )
    }] : [])
  ];

  return (
    <div className="flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="text-text flex items-center justify-start lg:justify-center pb-4 px-6">
          <h1 className="text-2xl w-fit font-poppins font-semibold text-left">
            Your Account
          </h1>
        </div>

        {/* NextUI Tabs */}
        <Tabs 
          aria-label="User Profile Options" 
          variant="underlined"
          color="primary"
          size="md"
          className="flex max-w-xs mx-auto flex-col px-4"
        >
          {tabs.map((tab) => (
            <Tab 
              key={tab.id} 
              title={tab.label}
              className="font-semibold"
            >
              <div className="px-4 pb-4 flex items-center justify-center">
                {tab.content}
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;