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
  title: string;
  description: string;
  id: string;
}

const BeamsTheatreShareButton: React.FC<ShareButtonProps> = ({ title, description,id }) => {
  const shareUrl = `${window.location.origin}/beams-theatre/${id}`;
  const shareTitle = `Hey, Check out this fascinating content on Beams! ${title}`;
  const shareText = `Hey, Check out this fascinating content on Beams! ${title}\n\n${description}`;

  const handleNativeShare = async () => {
    const shareData = {
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Successfully shared');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('Content copied to clipboard. You can now paste it to share.');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    } else {
      alert('Sharing not supported on your browser. Please copy the link manually.');
    }
  };

  return (
    <Popover placement="top">
      <PopoverTrigger>
        <Button size="sm" isIconOnly startContent={<Share size={20} className="text-gray-600" />} className="text-gray-60 bg-gray-200" />
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2">
          <div className="mb-2 font-bold">Share this content</div>
          <div className="flex gap-2">
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
            <Button size="sm" color="warning" onClick={handleNativeShare}>
              Others
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BeamsTheatreShareButton;
