import "server-only";
import { z } from "zod";

const schema = z.object({
  INTERNAL_API_BASE_URL: z.string().url(),
});

export const serverEnv = schema.parse({
  INTERNAL_API_BASE_URL: process.env.INTERNAL_API_BASE_URL,
});

export const siteOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${process.env.PORT ?? "3000"}`;
