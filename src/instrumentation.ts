/**
 * Asynchronously registers Sentry configuration based on the current runtime environment.
 * 
 * This function dynamically imports the appropriate Sentry configuration file
 * depending on whether the app is running in a Node.js or Edge environment.
 */
export async function register() {
  // Check if the runtime environment is Node.js
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamically import the Sentry server configuration
    await import('../sentry.server.config');
  }

  // Check if the runtime environment is Edge (for edge functions)
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Dynamically import the Sentry edge configuration
    await import('../sentry.edge.config');
  }
}
