// TimeZoneSetter.tsx
'use client';

import { useEffect } from 'react';

const TimeZoneSetter = () => {
  useEffect(() => {
    console.log("time setter called")
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Set the time zone in a cookie
    document.cookie = `client_time_zone=${timeZone}; path=/; SameSite=Lax;`;

    // Alternatively, you could also use a library like js-cookie for easier cookie management
  }, []);

  return null; // This component does not render anything
};

export default TimeZoneSetter;
