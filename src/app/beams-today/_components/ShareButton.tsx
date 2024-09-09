'use client'; // Ensures that the component is rendered on the client side in a Next.js environment.

import React from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react'; // Import UI components from NextUI.
import { Share } from 'iconsax-react'; // Import the Share icon from iconsax-react.
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share'; // Import share buttons and icons for social platforms from react-share.
import { BeamsToday } from '@/types/beamsToday'; // Import the BeamsToday type for type checking the props.

interface ShareButtonProps {
  data: BeamsToday; // The data prop contains information about the content being shared (e.g., title, description).
}

const ShareButton: React.FC<ShareButtonProps> = ({ data }) => {
  const shareUrl = window.location.href; // Use the current page URL as the share URL.
  const shareTitle = `Hey, Check out this fascinating content on Beams! ${data?.title}`; // The share title using the content's title.
  const shareText = `Hey, Check out this fascinating content on Beams! ${data?.title}\n\n${data?.shortDesc}`; // The share text combining title and description.

  // Function to handle native device sharing or copying the share link to clipboard.
  const handleNativeShare = async () => {
    const shareData = {
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    };

    if (navigator.share) { // Check if the native share API is available.
      try {
        await navigator.share(shareData); // Use the native share functionality if supported.
        console.log('Successfully shared');
      } catch (error) {
        console.error('Error sharing:', error); // Handle any errors during sharing.
      }
    } else if (navigator.clipboard) { // Fallback to copying to clipboard if native share is not available.
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('Content copied to clipboard. You can now paste it to share.'); // Notify the user that content was copied.
      } catch (error) {
        console.error('Error copying to clipboard:', error); // Handle any errors during clipboard copying.
      }
    } else {
      alert('Sharing not supported on your browser. Please copy the link manually.'); // Inform the user if neither option is available.
    }
  };

  return (
    <Popover placement="top"> {/* Display the popover with social share options at the top of the button */}
      <PopoverTrigger>
        <Button size={"sm"} isIconOnly startContent={<Share size={20} className='text-grey-2' />} className='bg-grey-1'>
          {/* The Share button with an icon to trigger the popover */}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2">
          <div className="mb-2 font-bold">Share this content</div> {/* Header text inside the popover */}
          <div className="flex gap-2"> {/* Container for the social share buttons */}
            {/* WhatsApp share button with icon */}
            <WhatsappShareButton url={shareUrl} title={shareTitle}>
              <WhatsappIcon size={32} round /> {/* Rounded WhatsApp icon */}
            </WhatsappShareButton>
            {/* Facebook share button with icon */}
            <FacebookShareButton url={shareUrl} title={shareTitle}>
              <FacebookIcon size={32} round /> {/* Rounded Facebook icon */}
            </FacebookShareButton>
            {/* Twitter share button with icon */}
            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <TwitterIcon size={32} round /> {/* Rounded Twitter icon */}
            </TwitterShareButton>
            {/* LinkedIn share button with icon */}
            <LinkedinShareButton url={shareUrl} title={shareTitle} summary={shareText}>
              <LinkedinIcon size={32} round /> {/* Rounded LinkedIn icon */}
            </LinkedinShareButton>
            {/* Button to trigger native sharing or fallback to clipboard */}
            <Button size="sm" color="warning" onClick={handleNativeShare}>
              Others
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton; // Export the ShareButton component for use in other parts of the application.
