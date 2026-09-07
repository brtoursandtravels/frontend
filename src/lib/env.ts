import "server-only";
import { z } from "zod";

const schema = z.object({
  INTERNAL_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

export const serverEnv = schema.parse({
  INTERNAL_API_BASE_URL: process.env.INTERNAL_API_BASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
