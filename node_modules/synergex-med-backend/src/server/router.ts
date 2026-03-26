import { router } from './trpc';
import { referralRouter } from './routers/referral';

/**
 * App Router - combines all routers
 */
export const appRouter = router({
  referral: referralRouter,
});

export type AppRouter = typeof appRouter;
