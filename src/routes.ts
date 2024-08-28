/**
 * Array of routes which don't require authentication
 * These routes don't require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/",'/auth/new-verification','/faq','/contact-us','/privacy','/terms', '/auth/change-email'];

/**
 * An array of routes which are used for authentication
 * These routes used to redirect the authenticated users to the /settings
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    '/auth/register',
    '/auth/error',
    '/auth/reset',
    '/auth/new-password',
    '/auth/forgot-identifiers',
    '/auth/user-info',
    '/auth/verify-email',
    '/auth/new-verify-email',
    '/auth/security-questions',
    '/auth/change-email-verify'
];

/**
 * A prefix for api authentication routes
 * Routes that start with this prefix are used for api authentication
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/beams-today";



