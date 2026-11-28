import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const g = globalThis as unknown as { pg?: ReturnType<typeof postgres> };
const client = g.pg ?? postgres(process.env.DATABASE_URL!, {
  // Transactional Pooler (PgBouncer): tanpa prepared statement dan tanpa pipelining.
  // Tanpa max_pipeline: 1, query yang mengantre di atas `max` menggantung selamanya.
  max: 10,
  prepare: false,
  max_pipeline: 1,
  connect_timeout: 10,
  idle_timeout: 20,
});
if (process.env.NODE_ENV !== "production") g.pg = client;

export const db = drizzle(client, { schema });
export { schema };
