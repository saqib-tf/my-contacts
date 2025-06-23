import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NETLIFY_DATABASE_URL || "",
  },
} satisfies Config;
