'use client';

import React from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react';
import { Share } from 'iconsax-react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';

interface ShareButtonProps {
  url: string;            // The URL to be shared
  shareTitle: string;     // The title for the shared content
  shareText: string;      // The text to include in the shared content
}

const ShareButton: React.FC<ShareButtonProps> = ({ url, shareTitle, shareText }) => {

  // Function to handle native device sharing or copying the share link to clipboard.
  const handleNativeShare = async () => {
    const shareData: any = {
      title: shareTitle,
      text: `${shareText}`,
      url: url,
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
        await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
        alert('Content copied to clipboard. You can now paste it to share.'); // Notify the user that content was copied.
      } catch (error) {
        console.error('Error copying to clipboard:', error); // Handle any errors during clipboard copying.
      }
    } else {
      alert('Sharing not supported on your browser. Please copy the link manually.'); // Inform the user if neither option is available.
    }
  };

  return (
    <Popover placement="top">
      <PopoverTrigger>
        <Button size={"sm"} startContent={<Share size={20} className='text-grey-2' />} className='bg-grey-1'>
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2">
          <div className="mb-2 font-bold">Share this achievement</div> {/* Header text inside the popover */}
          <div className="flex gap-2"> {/* Container for the social share buttons */}
            <WhatsappShareButton url={url} title={shareTitle} separator={shareText}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <FacebookShareButton 
              url={url} 
              title={shareText}    // Using quote to add additional text
              hashtag="#achievement"
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton 
              url={url} 
              title={shareTitle}   // Twitter will use this title and share URL
              via="YourAppName"
              hashtags={['achievement', 'success']}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton 
              url={url} 
              title={shareTitle}    // LinkedIn will show this title
              summary={shareText}   // LinkedIn will show this text as a summary
            >
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <Button size="sm" color="warning" onClick={handleNativeShare}>
              Others
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
