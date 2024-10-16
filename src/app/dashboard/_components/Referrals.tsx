import React from 'react';
import { Button, Card, CardBody, User } from "@nextui-org/react";
import { Gift, Profile2User } from "iconsax-react";
import { User as Users } from '@prisma/client';
import Image from 'next/image';

interface Referral {
  referrals: Users[]
}

const getAvatarSrc = (user: any) => user?.image;

export default function ReferralSection({ referrals }: Referral) {
  return (
    <Card className="w-full bg-transparent max-w-md shadow-none border-none outline-none">
      <CardBody className="outline-none p-0">
        {/* <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-start">
            <h2 className="text-lg md:text-2xl font-bold">My Referrals</h2>
            <div className="border-b-2 border-brand w-[60px]"></div>
          </div>
        </div> */}
        {referrals.length > 0 ? (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex bg-background items-center justify-between p-3 rounded-lg transition-all duration-300 ease-in-out"
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
            {/* <Profile2User size="48" className="text-grey-2 mb-4" /> */}
            <Image className='mb-4'  src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1728543913/authentication/gift-3d_yvf0u5.webp" alt="referraal" width={100} height={100} />
            <h3 className="text-lg md:text-xl font-semibold mb-2">No Referrals Yet? Let&apos;s Change That! </h3>
            <p className="text-grey-2 mb-4">
             More friends, more Beams, more fun.
            </p>
            <Button as={'a'} className="text-white font-semibold" href='/dashboard/?referral=true' color={"primary"} startContent={<Gift  variant="Bold" />} >Refer a Friend</Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}