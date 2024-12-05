'use client'
import { useState, useEffect } from 'react';
import { getOrCreateReferralCode } from "@/actions/auth/getOrCreateReferralCode";
import { createShortUrl } from '@/utils/urlShortener';
import { shareMetadataConfig } from '@/constants/shareMetadata';

export const useReferralUrl = () => {
  const [referralUrl, setReferralUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferralUrl = async () => {
      try {
        setIsLoading(true);
        const referralCode = await getOrCreateReferralCode();
        const fullUrl = `/auth/register?referral=${referralCode}`;
        const shortPath = await createShortUrl(
          fullUrl,
          {
            title: shareMetadataConfig.referral.title,
            description: shareMetadataConfig.referral.description,
            imageUrl: shareMetadataConfig.referral.imageUrl,
            type: 'website'
          }
        );
        setReferralUrl(`${window.location.origin}/s/${shortPath}`);
        setError(null);
      } catch (err) {
        setError('Failed to fetch referral URL');
        console.error('Error fetching referral URL:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralUrl();
  }, []);

  return { referralUrl, isLoading, error };
};