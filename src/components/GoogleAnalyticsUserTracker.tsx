// components/GoogleAnalyticsUserTracker.tsx
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function GoogleAnalyticsUserTracker() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email && typeof window !== 'undefined' && window.gtag) {
      // Create a hash of the email to use as user ID (for privacy)
      const userId = btoa(session.user.email).replace(/=/g, '');
      
      // Configure GA with user ID
      window.gtag('config', 'G-W7VPHJY727', {
        user_id: userId
      });

      // Set user properties
      window.gtag('set', 'user_properties', {
        user_id: userId,
        user_type: session.user.role || 'user',
        login_status: 'logged_in'
      });

      // Send a custom event
      window.gtag('event', 'user_identified', {
        user_id: userId,
        timestamp: new Date().toISOString()
      });
    }
  }, [session]);

  return null; // This component doesn't render anything
}