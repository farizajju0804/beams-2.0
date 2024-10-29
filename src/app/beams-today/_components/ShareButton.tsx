'use client';

import React, { useState, useEffect } from 'react';
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
import { BeamsToday } from '@/types/beamsToday';

interface ShareButtonProps {
  data: BeamsToday;
}

const ShareButton: React.FC<ShareButtonProps> = ({ data }) => {
  // Create a state to store the share URL
  const [shareUrl, setShareUrl] = useState<string>('');
  
  // Create states to track feature availability
  const [hasShareAPI, setHasShareAPI] = useState<boolean>(false);
  const [hasClipboard, setHasClipboard] = useState<boolean>(false);

  // Initialize browser-dependent values after component mounts
  useEffect(() => {
    // Set the share URL from window.location after component mounts
    setShareUrl(window.location.href);
    
    // Check for Web Share API availability
    setHasShareAPI('share' in navigator);
    
    // Check for Clipboard API availability
    setHasClipboard('clipboard' in navigator);
  }, []); // Empty dependency array means this runs once on mount

  // Prepare share content - moved outside of render to avoid recreation on each render
  const shareTitle = `Hey, Check out this fascinating content on Beams! ${data?.title}`;
  const shareText = `Hey, Check out this fascinating content on Beams! ${data?.title}\n\n${data?.shortDesc}`;

  // Handle native sharing with try-catch for better error handling
  const handleNativeShare = async () => {
    const shareData = {
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    };

    try {
      if (hasShareAPI) {
        // Use Web Share API if available
        await navigator.share(shareData);
        console.log('Successfully shared');
      } else if (hasClipboard) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('Content copied to clipboard. You can now paste it to share.');
      } else {
        // Final fallback if neither is available
        alert('Sharing not supported on your browser. Please copy the link manually.');
      }
    } catch (error) {
      // Comprehensive error handling
      console.error('Error during share operation:', error);
      if (error instanceof Error) {
        // If user aborted the share operation, don't show error
        if (error.name === 'AbortError') return;
        
        // Show user-friendly error message
        alert(`Unable to share: ${error.message}`);
      }
    }
  };

  // Don't render share buttons until we have the URL (prevents hydration mismatch)
  if (!shareUrl) {
    return (
      <Button size="sm" isIconOnly startContent={<Share size={20} className="text-grey-2" />} className="bg-grey-1">
        {/* Loading state button */}
      </Button>
    );
  }

  return (
    <Popover placement="top">
      <PopoverTrigger>
        <Button 
          size="sm" 
          isIconOnly 
          startContent={<Share size={20} className="text-grey-2" />} 
          className="bg-grey-1"
        />
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2">
          <div className="mb-2 font-bold">Share this content</div>
          <div className="flex gap-2">
            {/* Only render social share buttons if we have a URL */}
            <WhatsappShareButton url={shareUrl} title={shareTitle}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <FacebookShareButton url={shareUrl} title={shareTitle}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} title={shareTitle} summary={shareText}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <Button 
              size="sm" 
              color="warning" 
              onClick={handleNativeShare}
              disabled={!hasShareAPI && !hasClipboard}
            >
              Others
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;