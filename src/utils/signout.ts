import { signOut } from "next-auth/react";

const clearAuthCookies = () => {
  // List of possible auth cookie names
  const cookieNames = [
    'authjs.session-token',
    '__Secure-authjs.session-token'
  ];

  // Delete cookies across all possible domains and paths
  cookieNames.forEach(cookieName => {
    // Delete from root path
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    
    // Delete from current path
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${window.location.pathname}`;
    
    // Handle secure cookies in production
    if (window.location.protocol === 'https:') {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; domain=${window.location.hostname}`;
      // Also try with subdomain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; domain=.${window.location.hostname}`;
    }
  });
};

export const handleSignOut = async () => {
  try {
    // First, manually clear cookies
    clearAuthCookies();
    
    // Then use next-auth signOut
    await signOut({
      redirect: true,
      redirectTo: "/auth/login",
      // Force clean all auth state
      callbackUrl: "/auth/login"
    });
    
    // Additional cleanup
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      
      // Force reload to ensure clean state
      window.location.href = "/auth/login";
    }
  } catch (error) {
    console.error("Error during sign out:", error);
    // Fallback: force reload to login page if signOut fails
    if (typeof window !== 'undefined') {
      window.location.href = "/auth/login";
    }
  }
};

export default handleSignOut;