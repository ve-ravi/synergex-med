import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@synergex-med/shared';

const getBaseUrl = () => {
  // Always point to backend server
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  return 'http://localhost:3001';
};

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
    }),
  ],
});
