// ClientDateRedirect.tsx (Client-side component for redirecting)
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getClientDate } from "@/utils/getClientDate";

const ClientDateRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const clientDate = getClientDate();
    // Redirect to a dynamic route with clientDate
    router.replace(`/beams-today/${clientDate}`);
  }, [router]);

  return null;
};

export default ClientDateRedirect;
