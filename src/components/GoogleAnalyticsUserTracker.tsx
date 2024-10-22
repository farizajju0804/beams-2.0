// // components/GoogleAnalyticsUserTracker.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useSession } from 'next-auth/react';

// declare global {
//   interface Window {
//     gtag: (...args: any[]) => void;
//     dataLayer: Object[] | undefined;
//   }
// }

// export function GoogleAnalyticsUserTracker() {
//   const { data: session } = useSession();

//   useEffect(() => {
//     // Debug log to verify session
//     console.log('Session state:', session);

//     // Initialize dataLayer if it doesn't exist
//     window.dataLayer = window.dataLayer || [];
//     window.gtag = function() {
//       window.dataLayer?.push(arguments);
//     };

//     // Wait for GA to load
//     const waitForGa = setInterval(() => {
//       if (window.gtag) {
//         clearInterval(waitForGa);
        
//         if (session?.user?.email) {
//           // Create a hash of the email to use as user ID
//           const userId = btoa(session.user.email).replace(/=/g, '');
          
//           console.log('Sending user ID to GA:', userId);

//           // Send page_view with user ID
//           window.gtag('event', 'page_view', {
//             send_to: 'G-W7VPHJY727',
//             user_id: userId
//           });

//           // Configure GA with user ID
//           window.gtag('config', 'G-W7VPHJY727', {
//             user_id: userId,
//             debug_mode: true
//           });

//           // Set user properties
//           window.gtag('set', 'user_properties', {
//             user_id: userId,
//             user_type: session.user.role || 'user',
//             login_status: 'logged_in'
//           });

//           // Send a custom event
//           window.gtag('event', 'user_identified', {
//             user_id: userId,
//             timestamp: new Date().toISOString()
//           });
//         }
//       }
//     }, 100);

//     // Cleanup
//     return () => clearInterval(waitForGa);
//   }, [session]);

//   return null;
// }

import React from 'react'

const GoogleAnalyticsUserTracker = () => {
  return (
    <div>GoogleAnalyticsUserTracker</div>
  )
}

export default GoogleAnalyticsUserTracker