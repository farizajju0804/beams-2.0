'use client' // This indicates that the component should be rendered on the client side.
import React from 'react'; // Import React
import { Button, Card, CardBody, User } from "@nextui-org/react"; // Import components from NextUI
import { Gift } from "iconsax-react"; // Import icon for referral
import { User as Users } from '@prisma/client'; // Import User type from Prisma client
import Image from 'next/image'; // Import Next.js Image component for optimized images
import { useReferralModalStore } from '@/store/referralStore'; // Import custom hook for managing modal state
import { ReferFriendModal } from '@/components/ReferalModal'; // Import the referral modal component
import { REFERRAL_POINTS } from '@/constants/pointsConstants';

// Define the interface for the component props
interface Referral {
  referrals: Users[]; // Array of user referrals
}

// Helper function to get the avatar source from a user object
const getAvatarSrc = (user: any) => user?.image;

export default function ReferralSection({ referrals }: Referral) {
  // Get the function to open the referral modal from the store
  const openReferralModal = useReferralModalStore(state => state.openModal);

  return (
    <>
      {/* Main card container for referrals */}
      <Card className="w-full bg-transparent max-w-md shadow-none border-none outline-none">
        {referrals.length > 0 ? ( // Conditional rendering based on referrals array
          <CardBody className="outline-none p-0">
            <div className="space-y-4"> {/* Spacing between each referral */}
              {referrals.map((referral) => ( // Map through each referral
                <div
                  key={referral.id} // Unique key for each referral
                  className="flex bg-background items-center justify-between p-3 rounded-lg transition-all duration-300 ease-in-out"
                >
                  {/* User component to display the referral's name and avatar */}
                  <User
                  classNames={{
                    name : "text-xs md:text-sm",
                    
                  }}
                    name={`${referral.firstName} ${referral.lastName}`} // Full name of the referral
                    avatarProps={{
                      src: getAvatarSrc(referral), // Avatar source
                      showFallback: true, // Show fallback if no image is available
                      name: "", // Placeholder for name
                      alt: `${referral.firstName} ${referral.lastName}`, // Alt text for accessibility
                      classNames : {
                        img : "flex-1 flex-grow"
                          
                        
                      }
                    }}
                  />
                  {/* Display Beams earned from the referral */}
                  <div className="flex items-center">
                    <span className="text-brand text-sm mr-1 font-semibold">{REFERRAL_POINTS}</span> {/* Amount of Beams earned */}
                    <span className="text-sm text-grey-2">Beams</span> {/* Label for Beams */}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        ) : (
          // Rendered when there are no referrals
          <CardBody className="outline-none p-0 w-full">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              {/* Placeholder image when no referrals are present */}
              <Image 
                className='mb-4' 
                src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1728543913/authentication/gift-3d_yvf0u5.webp" 
                alt="referraal" 
                width={100} 
                height={100} 
              />
              <h3 className="text-lg md:text-xl font-semibold mb-2">No Referrals Yet? Let&apos;s Change That!</h3> {/* Encouraging message */}
              <p className="text-grey-2 mb-4">
                More friends, more Beams, more fun. {/* Description encouraging referrals */}
              </p>
              {/* Button to open the referral modal */}
              <Button 
                onClick={openReferralModal} // Open modal on click
                className="text-white font-semibold"  
                color={"primary"} 
                startContent={<Gift variant="Bold" />} // Icon before button text
              >
                Refer a Friend {/* Button label */}
              </Button>
            </div>
          </CardBody>
        )}
      </Card>
      {/* Referral modal component */}
      <ReferFriendModal />
    </>
  );
}
