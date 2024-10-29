// components/OnlineStatus.tsx
"use client";

import { useState, useEffect } from "react";

const OnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        width: "100%",
        padding: "1rem",
        backgroundColor: "red",
        color: "white",
        textAlign: "center",
        zIndex: 1000
      }}>
        You are offline. Please check your internet connection.
      </div>
    );
  }

  return null; // Return nothing if online
};

export default OnlineStatus;
