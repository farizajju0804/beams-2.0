'use client';
import React, { useState } from "react";
import PersonalInfoForm from "@/app/my-profile/_components/PersonalInfoForm";
import ChangeEmailForm from "@/app/my-profile/_components/ChangeEmailForm";
import ChangePasswordForm from "@/app/my-profile/_components/ChangePasswordForm";
import { motion } from 'framer-motion';
import TwoFactorAuthForm from "./2FAForm";

const UserProfile = ({ user,isOAuth }: { user: any, isOAuth : any }) => {
  const [selectedTab, setSelectedTab] = useState("Personal Info");

  const tabs = [
    { name: "Personal Info", component: <PersonalInfoForm user={user} isOAuth={isOAuth} /> },
    ...(!isOAuth ? [
      { name: "Security", component: (
        <div className="w-full flex items-center gap-8 justify-center flex-col">
          <ChangeEmailForm user={user} />
          <ChangePasswordForm />
          <TwoFactorAuthForm user={user}/>
        </div>
      ) },
    ] : []),
  ];

  return (
    <div className="flex flex-col items-center justify-start p-4">
      <motion.div 
        className="w-full max-w-3xl rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className=" text-text flex items-center justify-start lg:justify-center pb-4 px-6">
          <h1 className="text-2xl w-fit font-poppins font-semibold text-left">Your Account</h1>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-start lg:justify-center p-4 lg:px-8 ">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setSelectedTab(tab.name)}
                className={`text-center mx-2 mb-2 py-1 ${selectedTab === tab.name ? 'text-text font-bold border-b border-brand' : 'text-grey-2'}`}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <motion.div
            className="px-4 pb-4 flex items-center justify-center"
            key={selectedTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tabs.find((tab) => tab.name === selectedTab)?.component}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
