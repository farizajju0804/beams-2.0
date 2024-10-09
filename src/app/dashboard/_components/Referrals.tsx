import React from 'react';
import { Card, CardBody, User } from "@nextui-org/react";
import { Profile2User } from "iconsax-react";
import { User as Users } from '@prisma/client';

interface Referral {
  referrals: Users[]
}

const getAvatarSrc = (user: any) => user?.image;

export default function ReferralSection({ referrals }: Referral) {
  return (
    <Card className="w-full max-w-md px-6 lg:px-0 shadow-none border-none outline-none">
      <CardBody className="outline-none p-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-start">
            <h2 className="text-lg md:text-2xl font-bold">My Referrals</h2>
            <div className="border-b-2 border-brand w-[60px]"></div>
          </div>
        </div>
        {referrals.length > 0 ? (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-3 bg-grey-1 rounded-lg transition-all duration-300 ease-in-out"
              >
                <User
                  name={`${referral.firstName} ${referral.lastName}`}
                  avatarProps={{
                    src: getAvatarSrc(referral),
                    showFallback: true,
                    name: "",
                    alt: `${referral.firstName} ${referral.lastName}`,
                  }}
                />
                <div className="flex items-center space-x-2">
                  <span className="text-brand font-semibold">+20</span>
                  <span className="text-sm text-grey-2">Beams</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Profile2User size="48" className="text-grey-2 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Referrals Yet</h3>
            <p className="text-grey-2">
              Start inviting friends and colleagues to earn Beams!
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}