import { headers } from 'next/headers'; // Import the headers utility from Next.js to access request headers

/**
 * Retrieves the client's IP address from the request headers.
 * 
 * The function first checks the 'x-forwarded-for' header, which can contain multiple IP addresses
 * if the request passed through multiple proxies. If present, the first IP in the list is used.
 * If 'x-forwarded-for' is not found, it falls back to the 'x-real-ip' header.
 * If both headers are unavailable, it returns a fallback IP address.
 * 
 * @returns {string} - The client's IP address or a fallback IP if none is available.
 */
export function getClientIp() {
  const FALLBACK_IP_ADDRESS = '0.0.0.0'; // Fallback IP address in case no IP is found in the headers
  const forwardedFor = headers().get('x-forwarded-for'); // Retrieve the 'x-forwarded-for' header

  // If 'x-forwarded-for' exists, split by commas and use the first IP, else return fallback
  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS;
  }

  // If 'x-forwarded-for' is not found, check 'x-real-ip' and use it, or return the fallback IP
  return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS;
}
