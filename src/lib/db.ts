import { DB } from "./db/types.ts"; // this is the Database interface we defined earlier
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import "jsr:@std/dotenv/load";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: Deno.env.get("DIRECT_DBNAME"),
    host: Deno.env.get("DIRECT_HOST"),
    user: Deno.env.get("DIRECT_ID"),
    port: Deno.env.get("DIRECT_PORT"),
    max: Deno.env.get("DIRECT_MAXCON"),
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
});
