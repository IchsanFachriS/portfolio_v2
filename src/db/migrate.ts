import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false, onnotice: () => {} });
migrate(drizzle(client), { migrationsFolder: "./drizzle" })
  .then(() => console.log("Migrasi selesai."))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => client.end());
