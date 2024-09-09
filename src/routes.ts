/**
 * Array of routes that do not require authentication.
 * 
 * These routes are publicly accessible and do not require the user to be logged in.
 * Typically used for pages like the homepage, privacy policy, and contact forms.
 * 
 * @type {string[]}
 */
export const publicRoutes = [
    "/", // Homepage
    "/auth/new-verification", // Route to request a new email verification
    "/privacy", // Privacy policy page
    "/terms", // Terms and conditions page
    "/contact-us", // Contact form page
    "/auth/change-email", // Route for changing email address
    "/auth/change-email-verify" // Route for verifying email change
  ];
  
  /**
   * Array of routes used specifically for authentication purposes.
   * 
   * These routes are where users can perform authentication-related actions
   * like logging in, registering, and resetting passwords. Authenticated users 
   * will typically be redirected from these routes to another part of the app.
   * 
   * @type {string[]}
   */
  export const authRoutes = [
    "/auth/login", // Login page
    "/auth/register", // Registration page
    "/auth/error", // Error page for handling authentication errors
    "/auth/reset", // Password reset page
    "/auth/new-password", // New password creation page after reset
    "/auth/forgot-identifiers", // Page to help users recover their email/username
    "/auth/user-info", // Page to enter user information during onboarding
    "/auth/verify-email", // Route for email verification
    "/auth/new-verify-email", // Request a new email verification
    "/auth/security-questions" // Security questions setup page
  ];
  
  /**
   * A prefix for API authentication routes.
   * 
   * Routes that start with this prefix are typically used for handling API
   * requests related to authentication, such as logging in, registering, or
   * managing user sessions.
   * 
   * @type {string}
   */
  export const apiAuthPrefix = "/api/auth";
  
  /**
   * Default redirect route after successful login.
   * 
   * This route is used to redirect users after a successful login attempt.
   * It usually points to the main dashboard or content of the application.
   * 
   * @type {string}
   */
  export const DEFAULT_LOGIN_REDIRECT = "/beams-today"; // Default redirect after login
  