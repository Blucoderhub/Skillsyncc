import { z } from 'zod';
import { insertProblemSchema, insertSubmissionSchema, insertHackathonSchema, problems, hackathons, userProgress } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  problems: {
    list: {
      method: 'GET' as const,
      path: '/api/problems',
      input: z.object({ category: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof problems.$inferSelect & { isSolved?: boolean }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/problems/:slug',
      responses: {
        200: z.custom<typeof problems.$inferSelect & { isSolved?: boolean }>(),
        404: errorSchemas.notFound,
      },
    },
    submit: {
      method: 'POST' as const,
      path: '/api/problems/:id/submit',
      input: z.object({ code: z.string(), language: z.string() }),
      responses: {
        200: z.object({
          success: z.boolean(),
          output: z.string(),
          passed: z.boolean(),
          xpEarned: z.number().optional(),
          nextProblemSlug: z.string().optional()
        }),
        404: errorSchemas.notFound,
      },
    },
  },
  hackathons: {
    list: {
      method: 'GET' as const,
      path: '/api/hackathons',
      responses: {
        200: z.array(z.custom<typeof hackathons.$inferSelect>()),
      },
    },
  },
  user: {
    stats: {
      method: 'GET' as const,
      path: '/api/user/stats',
      responses: {
        200: z.custom<typeof userProgress.$inferSelect>(),
        401: errorSchemas.internal, // unauthorized
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
