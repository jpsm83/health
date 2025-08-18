import { authConfig } from './auth';

// Export only the handlers for Next.js 15 compatibility
export const { GET, POST } = authConfig.handlers;
