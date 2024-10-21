'use client'
import { useState, useEffect } from 'react';
import { getOrCreateReferralCode } from "@/actions/auth/getOrCreateReferralCode";

export const useReferralUrl = () => {
  const [referralUrl, setReferralUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferralUrl = async () => {
      try {
        setIsLoading(true);
        const referralCode = await getOrCreateReferralCode();
        setReferralUrl(`${window.location.origin}/auth/register?referral=${referralCode}`);
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