import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Use Netlify-provided environment variables for database connection
const connectionString =
  process.env.NETLIFY_DATABASE_URL || process.env.NETLIFY_DATABASE_URL_UNPOOLED;

if (!connectionString) {
  throw new Error(
    "Database connection string is not set. Please set NETLIFY_DATABASE_URL or NETLIFY_DATABASE_URL_UNPOOLED."
  );
}

const client = postgres(connectionString, { ssl: "require" });

export const db = drizzle(client);
