/**
 * This file re-exports types from the backend's tRPC router
 * Used for frontend type safety with tRPC client
 * 
 * This is a type-only export and doesn't create a runtime dependency
 */
export type { AppRouter } from '../../../backend/src/server/router';
