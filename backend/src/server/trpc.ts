import { initTRPC } from '@trpc/server';
import { ZodError } from 'zod';

/**
 * Initialize tRPC with error formatting
 */
const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;

/**
 * Logging middleware
 */
export const loggerMiddleware = middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;

  console.log(`[${type.toUpperCase()}] ${path} - ${duration}ms`);

  return result;
});

/**
 * Public procedure with logging
 */
export const publicProcedure = procedure.use(loggerMiddleware);
