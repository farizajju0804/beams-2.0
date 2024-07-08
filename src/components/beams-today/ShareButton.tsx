'use client';
import React from 'react';
import { Button } from '@nextui-org/react';
import { BeamsToday } from '@/types/beamsToday';

interface ShareButtonProps {
  data: BeamsToday;
}
const ShareButton:React.FC<ShareButtonProps> = ({ data }) => {
  const handleShare = async () => {
    const shareData = {
      title: `Hey, Check out this fascinating content on Beams! ${data?.title}`,
      text: `Hey, Check out this fascinating content on Beams! ${data?.title}\n\n${data?.shortDesc}`,
      url: window.location.href,
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
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert('Content copied to clipboard. You can now paste it to share.');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    } else {
      alert('Sharing not supported on your browser. Please copy the link manually.');
    }
  };

  return <Button onClick={handleShare}>Share</Button>;
};

export default ShareButton;
