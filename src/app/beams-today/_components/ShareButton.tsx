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
  const [shareUrl, setShareUrl] = useState<string>('');
  const [hasShareAPI, setHasShareAPI] = useState<boolean>(false);
  const [hasClipboard, setHasClipboard] = useState<boolean>(false);

  useEffect(() => {
    // Set canonical URL for sharing
    const baseUrl = 'https://www.beams.world';
    const path = `/api/metadata/beams-today/${data.id}`;
    setShareUrl(window.location.hostname === 'localhost' ? `${baseUrl}${path}` : `${window.location.origin}${path}`);
    
    setHasShareAPI('share' in navigator);
    setHasClipboard('clipboard' in navigator);
  }, [data.id]);

  const shareContent = {
    facebook: {
      quote: `Exploring "${data.title}" on Beams Today!

${data.shortDesc}

Join me in discovering fascinating insights about emerging technologies! 🚀`,
      hashtag: '#BeamsLearning'
    },
    twitter: {
      text: `Fascinating read on @BeamsWorld!

"${data.title}"

Join me in exploring the future of technology!`,
      hashtags: ['BeamsLearning', 'FutureOfTech', 'TechLearning'],
      via: 'BeamsWorld'
    },
    linkedin: {
      title: `${data.title} | Beams Today`,
      summary: `🎯 I just learned about "${data.title}" on Beams Today!

${data.shortDesc}

Join me in exploring emerging technologies and shaping the future of learning! 🚀`,
      source: 'Beams Today'
    },
    whatsapp: {
      text: `Hey, Check out what I'm learning on Beams Today!

 *${data.title}*

${data.shortDesc}

Join me in exploring this fascinating topic!`
    }
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: `${data.title} | Beams Today`,
      text: `🎯 Check out what I'm learning on Beams Today!

📚 ${data.title}

${data.shortDesc}

Join me in exploring this fascinating topic!`,
      url: shareUrl
    };

    try {
      if (hasShareAPI) {
        await navigator.share(shareData);
      } else if (hasClipboard) {
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareUrl}`);
        alert('Content copied to clipboard!');
      } else {
        alert('Sharing not supported on your browser. Please copy the link manually.');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share error:', error);
      }
    }
  };

  if (!shareUrl) {
    return (
      <Button 
        size="sm" 
        isIconOnly 
        startContent={<Share size={20} className="text-grey-2" />} 
        className="bg-grey-1"
      />
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
        <div className="p-4">
          <div className="mb-3 font-semibold text-lg">Share This Topic</div>
          <div className="flex gap-3">
            <WhatsappShareButton 
              url={shareUrl} 
              title={shareContent.whatsapp.text}
              className="hover:opacity-80 transition-opacity"
            >
              <WhatsappIcon size={36} round />
            </WhatsappShareButton>

            <FacebookShareButton 
              url={shareUrl} 
              title={shareContent.facebook.quote}
              hashtag={shareContent.facebook.hashtag}
              className="hover:opacity-80 transition-opacity"
            >
              <FacebookIcon size={36} round />
            </FacebookShareButton>

            <TwitterShareButton 
              url={shareUrl} 
              title={shareContent.twitter.text}
              hashtags={shareContent.twitter.hashtags}
              via={shareContent.twitter.via}
              className="hover:opacity-80 transition-opacity"
            >
              <TwitterIcon size={36} round />
            </TwitterShareButton>

            <LinkedinShareButton 
              url={shareUrl} 
              title={shareContent.linkedin.title}
              summary={shareContent.linkedin.summary}
              source={shareContent.linkedin.source}
              className="hover:opacity-80 transition-opacity"
            >
              <LinkedinIcon size={36} round />
            </LinkedinShareButton>

            <Button 
              size="lg"
              className="bg-primary text-white hover:opacity-90 transition-all"
              onClick={handleNativeShare}
              disabled={!hasShareAPI && !hasClipboard}
            >
              More
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;